import { mysql } from '../database/mysql';
import menuData from '../common/menu_data';
import CommonComponent from './index';

class Menu extends CommonComponent {
  constructor () {
    super();
  }
  async initTable () {
    const rows = await mysql(`SELECT id FROM job_menu ORDER BY id LIMIT 0,1`);
    /**
     * 若无数据则初始化职位菜单数据
     */
    if(!Array.prototype.toString.call(rows)) {
      console.log('初始化职位菜单数据')
      this.saveJobMenu();
    }
  }
  /**
   * 保存所有职位菜单数据
   */
  async saveJobMenu() {
    const arr = [];
    menuData.forEach(_v => {
      let _p = new Promise(async resolve => {
        await mysql(
          `INSERT INTO job_menu SET ?`,
          _v,
        );
        resolve();
      });
      arr.push(_p);
    });
    await Promise.all(arr);
  }
}

export default new Menu();