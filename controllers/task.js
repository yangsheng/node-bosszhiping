import schedule from 'node-schedule';
import Reptile from './reptile';
import request from 'superagent';
import SuperagentProxy from 'superagent-proxy';
import CommonComponent from './index';
import ProxyController from './proxy';
import menuData from '../common/menu_data';
SuperagentProxy(request);

import {
  mysql
} from '../database/mysql';


class Task extends CommonComponent {
  /**
   * 定时任务爬虫
   */
  constructor() {
    super();
    this.retileTaskDateTime = '*/7'; // 定时任务每周日抓取一次数据
    this.proxyTaskDateTime = '*/30 * * * *' // 定时任务30分支更换一次代理
  }

  async reptileScheduled() {
    const [job_rows] = await mysql(`SELECT COUNT(*) AS count FROM job_data`);
    if (!job_rows.count) { // 若数据库数据为空 则初始化爬取一次数据
      console.log('now data is empty，make the first reptile.');
      this.reptileAllJob();
    }

    schedule.scheduleJob(this.retileTaskDateTime, () => {
      console.log('runing reptileAllJob week task.');
      this.reptileAllJob()
    });

    schedule.scheduleJob(this.proxyTaskDateTime, () => {
      console.log('runing updateProxyData task.');
      ProxyController.updateProxyData();
    });
  }
  async reptileAllJob () {
    let index = 0;
    const get = async () => {
      if(index > menuData.length) {
        const [row] = await mysql(`SELECT COUNT(*) AS count FROM job_data`);
        console.log(`All reptile complete update ${row.count} data................................`);
        return false;
      };
      const item = menuData[index];
      await this.reptileJob(item);
      index+=1;
      return get();
    }
    get();
  }
  async reptileJob(item) {
    const { name: jobTypeName, code: jobTypeCode, parent: jobTypeParentName } = item;
    const resultData = await Reptile.getAllJobData({
      jobTypeCode,
      jobTypeName,
      jobTypeParentName,
    }).catch(err => {
      throw Error(err)
    });
    if(!resultData || resultData.length<=0) {
      console.log('data is empty')
      return false;
    }
    const duplicatesData = this.duplicates(resultData,'jobId');
    console.log('resultData totalLength:',resultData.length);
    const _p = [];
    let [insertCount,updateCount] = [0,0];
    duplicatesData.forEach(data => {
      let p = new Promise(async resolve => {
        const [queryRow] = await mysql(`SELECT COUNT(*) AS count FROM job_data WHERE jobId = ?`, data.jobId).catch(err => {});;
        if (!queryRow.count) { // 如果没有记录 则插入新纪录 若有则更新记录
          await mysql(`INSERT INTO job_data SET ?`, data).catch(err => {});
          insertCount += 1;
        } else {
          const {
            jobId
          } = data;
          delete data.jobId;
          updateCount += 1;
          await mysql(`UPDATE job_data SET ? WHERE jobId = ${jobId}`, data).catch(err => {});
        }
        resolve()
      });
      _p.push(p);
    });
    await Promise.all(_p).catch((err) => {});
    console.log(`reptile complete，update data successfully. ${resultData.length} total. duplicates ${resultData.length - duplicatesData.length}. ${insertCount} insert.  ${updateCount} updated. ${new Date()}`);
  }
}

export default new Task();