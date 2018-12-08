import { mysql } from '../database/mysql';
import { addressData as CityData } from '../common/addressData';
import CommonComponent from "./index";

class City extends CommonComponent {
  constructor() {
    super();
  }
  async initTable() {
    /**
     * 若city_data表 为空.则初始化表数据
     */
    const rows = await mysql(`SELECT id FROM city_data ORDER BY id LIMIT 0,1`);
    if(!Array.prototype.toString.call(rows)) { 
      console.log('初始化地区数据');
      this.saveCityData() 
    };
  }
  /**
   * 保存地区表
   */
  saveCityData() {
    return new Promise(async resolve => {
      const arr = [];
      CityData.forEach( _v => {
        let _p = new Promise(async _r => {
          await mysql(
            `INSERT INTO city_data SET ?`,
            _v,
          );
          _r();
        });
        arr.push(_p);
      });
      await Promise.all(arr);
      resolve();
    })
  }
}

export default new City();