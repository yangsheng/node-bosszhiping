import request from 'superagent';
import SuperagentProxy from 'superagent-proxy';
import { mysql } from '../database/mysql';
SuperagentProxy(request);
/**
 * 公共类库
 */
class CommonComponent {
  constructor() {
    
  }
  /**
   * 延迟器
   * @param {number} timeout
   * @returns {Promise}<T>
   */
  sleep(timeout = 0) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }
  /**
   * 获取一条代理
   */
  async getProxy () {
    const rows = await mysql(`SELECT code FROM proxy_data`);
    try {
      return rows[parseInt(Math.random() * rows.length)].code;
    } catch (error) {
      return null;      
    }
  }
  /**
   * 数组去重
   * @param array
   * @param key
   * @returns array
   */
  duplicates (array,key) {
    if(!Array.isArray(array) || array.length<=0) return [];
    const arr = [];
    for (let index = 0; index < array.length; index++) {
      const item = array[index];
      for (let j = 0; j < array.length; j++) {
        const child = array[j];
        if(arr.findIndex(k => (k[key] === child[key])) === -1) {
          arr.push(child);
        }
      }
    };
    return arr;
  }
}

export default CommonComponent;