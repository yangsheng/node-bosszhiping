import request from 'superagent';
import SuperagentProxy from 'superagent-proxy';
import CommonComponent from './index';
import { mysql } from '../database/mysql';
SuperagentProxy(request);

export default new class extends CommonComponent {
  constructor(...arg) {
    super(...arg);
    this.proxyList = [];
    this.headers = {
      "Content-Type": "application/json",
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
      'User-Agent': 'Mozilla/8.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
      'referer': 'http://www.89ip.cn/'
    };
  }
  /**
   * 初始化表
   */
  async initTable () {
    const proxy_rows = await mysql(`SELECT id FROM proxy_data`);
    if(proxy_rows.length < 10) { // 若代理数据小于五条则更新
      console.log('now proxy_data is empty，make the first updated.');
      await this.updateProxyData();
    }
  }
  /**
   * 获取一条代理IP
   */
  async getProxy() {
    // const proxyList = [
    //   ''
    // ]; // 可用的代理列表
    const baseProxy = 'http://www.89ip.cn/tqdl.html?api=1&num=50&port=&address=&isp=';//proxyList[parseInt(Math.random() * proxyList.length)];
    const result = await request.get(baseProxy).set('headers', this.headers).timeout(5000).catch(() => Promise.reject());
    try {
      const startIndex = result.text.lastIndexOf('</script>') + 10;
      const endIndex = result.text.lastIndexOf('<br>');
      const data = result.text.substring(startIndex, endIndex).split('<br>');
      const random = parseInt(Math.random() * data.length);
      const _proxy = data[random]; // 获取一条代理
      return Promise.resolve(_proxy);
    } catch (error) {
      return Promise.reject();
    }
  }
  /**
   * 获取可用代理数据
   */
  async getUsableProxyData(count = 50, timeout = 6000) {
    return new Promise(resolve => {
      const resultProxy = [];
      for (let i = 0; i < count; i++) {
        let _p = new Promise(async resolve => {
          const proxy = await this.getProxy();
          try {
            request.get(`https://www.ip.cn`).set('headers', this.headers).proxy(`http://${proxy}`).timeout(timeout).then((response) => {
              if (response && response.text) {
                resolve(proxy); // 当前代理可用则添加到列表 ，超时则剔除
              }
            }).catch(() => resolve(null));
          } catch (error) {
            resolve(null);
          }
        });
        resultProxy.push(_p);
      };
      Promise.all(resultProxy).catch(() => {}).then(res => {
        resolve(res.filter(i => (i !== null && typeof i === 'string')));
      });
    })
  }

  /**
   * 更新数据库代理数据
   */
  async updateProxyData() {
    const resultData = await this.getUsableProxyData(70).catch(err => {
      throw Error(err)
    });
    if (!resultData || resultData.length <= 0) {
      console.log('data is empty')
      return false;
    }
    const _p = [];
    let update_count = 0;
    const [rowsCount] = await mysql(`SELECT COUNT(*) AS count FROM proxy_data`);
    if(rowsCount.count > 2) { // 这里是为了如果在抓取过程中保证能拿到代理ip
      await mysql(`DELETE FROM proxy_data ORDER BY RAND() LIMIT ${rowsCount.count-2}`);
    };
    resultData.forEach(data => {
      let p = new Promise(async resolve => {
        const rows = await mysql(`SELECT id FROM proxy_data WHERE code = ?`,data);
        if(!Array.isArray(rows) || !rows.length) {
          await mysql(`INSERT INTO proxy_data SET code = ?`, data).catch(err => {});
          update_count+=1;
        }
        resolve()
      });
      _p.push(p);
    });
    await Promise.all(_p).catch((err) => {});
    console.log(`updated complete，update data successfully, ${update_count} updated.`)
  }
}();