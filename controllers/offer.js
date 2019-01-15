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
  async getNationalStatistics(_,res) {
    const { [0]: { count } } = await mysql(`SELECT COUNT(id) AS count FROM job_data`);
    const  { [0]: { count: jobCount } } = await mysql(`SELECT COUNT(*) AS count FROM (SELECT COUNT(jobTypeName) FROM job_data GROUP BY jobTypeName) AS t`);
    const areaJobCount = await mysql(`SELECT province,COUNT(*) AS count FROM job_data GROUP BY province ORDER BY count DESC`);
    const maximumJob = await mysql(`SELECT jobTypeName AS name,COUNT(*) AS count FROM job_data GROUP BY jobTypeName ORDER BY count DESC`);
    const financingData = await mysql(`SELECT financing AS name, COUNT(financing) AS count FROM job_data GROUP BY financing ORDER BY count DESC`);
    const educationData = await mysql(`SELECT education AS name, COUNT(education) AS count FROM job_data GROUP BY education ORDER BY count DESC`);
    const salaryData = await mysql(`SELECT companyName AS name, MAX(maxSalary) as salary FROM job_data GROUP BY companyName ORDER BY salary DESC LIMIT 0,20`);
    const { [0]: { averageSalary } } = await mysql(`SELECT AVG(salary) AS averageSalary FROM (SELECT companyName AS name, MAX(maxSalary) as salary FROM job_data GROUP BY companyName ORDER BY salary DESC) AS T`);
    const companySizeData = await mysql(`SELECT companySize AS name, COUNT(companySize) AS count FROM job_data GROUP BY companySize`);
    res.send({
      code: 0,
      data: {
        jobCount: jobCount,
        jobTotalCount: count,
        areaJobCount,
        maximumJob,
        financingData,
        educationData,
        salaryData: {
          salaryData,
          averageSalary,
        },
        companySizeData,
      },
    })
  }
  async getIndustryStatistics(req,res) {
    const { province } = req.query;
    if(!province)return res.send({
      code: 1,
      data: null,
      msg: '缺少字段',
    });
    const { [0]: { jobTotalCount } } = await mysql(`SELECT COUNT(id) AS count FROM job_data WHERE jobTypeParentName = ? and province = ?`,['前端开发',province]);
    const provinceJobCount = await mysql(`SELECT province,COUNT(*) AS count FROM job_data WHERE jobTypeParentName = ? GROUP BY province ORDER BY count DESC`,'前端开发');
    const financingData = await mysql(`SELECT financing AS name, COUNT(financing) AS count FROM job_data WHERE jobTypeParentName = ? and province = ? GROUP BY financing ORDER BY count DESC`,['前端开发',province]);
    const companysizeData = await mysql(`SELECT companySize AS name, COUNT(companySize) AS count FROM job_data WHERE jobTypeParentName = ? and province = ? GROUP BY companySize ORDER BY count DESC`,['前端开发',province]);
    const educationData = await mysql(`SELECT education AS name, COUNT(education) AS count FROM job_data WHERE jobTypeParentName = ? and province = ? GROUP BY education ORDER BY count DESC`,['前端开发',province]);
    const salaryData = await mysql(`SELECT companyName AS name, MAX(maxSalary) as salary FROM job_data WHERE jobTypeParentName = ? and province = ? GROUP BY companyName ORDER BY salary DESC LIMIT 0,20`,['前端开发',province]);
    const { [0]: { averageSalary } } = await mysql(`SELECT AVG(salary) AS averageSalary FROM (SELECT companyName AS name, MAX(maxSalary) as salary FROM job_data WHERE jobTypeParentName = ? and province = ? GROUP BY companyName ORDER BY salary DESC) AS T`,['前端开发',province]);
    const experienceData = await mysql(`SELECT experience AS name FROM job_data WHERE jobTypeParentName = ? and province = ? GROUP BY experience`,['前端开发',province]);
    const experienceSalaryData = [];
    const educationSalaryData = [];
    experienceData.forEach(e => {
      let p = new Promise(async resolve => {
        const { [0]: { averageSalary: single } } = await mysql(`SELECT AVG(salary) AS averageSalary FROM (SELECT experience AS name, MAX(maxSalary) as salary FROM job_data WHERE experience = ? and jobTypeParentName = ? and province = ? GROUP BY companyName ORDER BY salary DESC) AS T`,[e.name,'前端开发',province]);
        let singleData = ({
          name: e.name,
          averageSalary: single,
        });
        resolve(singleData);
      });
      experienceSalaryData.push(p);
    });
    educationData.forEach(e => {
      let p = new Promise(async resolve => {
        const { [0]: { averageSalary: single } } = await mysql(`SELECT AVG(salary) AS averageSalary FROM (SELECT education AS name, MAX(maxSalary) as salary FROM job_data WHERE education = ? and jobTypeParentName = ? and province = ? GROUP BY companyName ORDER BY salary DESC) AS T`,[e.name,'前端开发',province]);
        let singleData = ({
          name: e.name,
          averageSalary: single,
        });
        resolve(singleData);
      });
      educationSalaryData.push(p);
    });
    const _experienceSalaryData = await Promise.all(experienceSalaryData);
    const _educationSalaryData = await Promise.all(educationSalaryData);
    res.send({
      code: 0,
      data: {
        jobTotalCount,
        provinceJobCount,
        financingData,
        companysizeData,
        educationData,
        salary: {
          salaryData,
          averageSalary,
        },
        experienceSalaryData: _experienceSalaryData,
        educationSalaryData: _educationSalaryData,
        experienceData,
      },
    });
  }
}

export default new Offer();