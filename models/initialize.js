import { mysql } from '../database/mysql';

class Database {
  /**
   * 初始化数据库
   */
  async initializeDatabase() {
    return new Promise(async resolve => {
      await mysql(`CREATE Database IF NOT EXISTS boss_zhiping Character Set UTF8`);
      await mysql(
        `CREATE TABLE IF NOT EXISTS boss_zhiping.job_data (
          id INT PRIMARY KEY AUTO_INCREMENT,
          jobId VARCHAR(200) NOT NULL UNIQUE,
          name VARCHAR(200) NOT NULL,
          companyName VARCHAR(100),
          industry VARCHAR(100),
          financing VARCHAR(50),
          companySize VARCHAR(100),
          description VARCHAR(3000),
          maxSalary INT DEFAULT 0,
          minSalary INT DEFAULT 0,
          province VARCHAR(50),
          city VARCHAR(50),
          area VARCHAR(50),
          education VARCHAR(20),
          experience VARCHAR(50),
          jobTypeCode VARCHAR(100),
          jobTypeName VARCHAR(100),
          jobTypeParentName VARCHAR(100)
        )`
      );
      await mysql(
        `CREATE TABLE IF NOT EXISTS boss_zhiping.city_data (
          id INT PRIMARY KEY AUTO_INCREMENT,
          parent VARCHAR(50) NOT NULL,
          code VARCHAR(50) NOT NULL UNIQUE,
          name VARCHAR(50) NOT NULL UNIQUE
        )`
      );
      await mysql(
        `CREATE TABLE IF NOT EXISTS boss_zhiping.job_menu (
          id INT PRIMARY KEY AUTO_INCREMENT,
          parent VARCHAR(50) NOT NULL,
          code VARCHAR(100) NOT NULL UNIQUE,
          name VARCHAR(100) NOT NULL
        )`
      );
      await mysql(
        `CREATE TABLE IF NOT EXISTS boss_zhiping.proxy_data (
          id INT PRIMARY KEY AUTO_INCREMENT,
          code VARCHAR(100) NOT NULL UNIQUE
        )`
      );
      resolve();
    })
  }
}

export default new Database();

