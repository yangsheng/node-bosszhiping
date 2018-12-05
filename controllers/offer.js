import { mysql } from '../database/mysql';
import CommonComponent from './index';

class Offer extends CommonComponent {
  constructor() {
    super();
  }
  async getOfferList(req,res) {
    const { pageSize, pageNum } = req.query;
    if(!pageSize || !pageNum) return res.send({
      code: 1,
      data: '缺少页码参数',
    });
    const startPage = (pageNum - 1) * pageSize;
    const rows = await mysql(
      `SELECT * FROM job_data limit ${startPage},${pageSize}`
    );
    res.send({
      code: 0,
      data: rows,
      total: rows.length,
    });
  }
  async getOffer(req,res) {
    const { id } = req.query;
    const rows = await mysql(
      `SELECT * FROM job_data where id = ?`,
      id
    );
    res.send({
      code: 0,
      data: rows,
      total: rows.length,
    });
  }
}

export default new Offer();