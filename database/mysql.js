import _ from 'mysql';

export const pool = _.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'boss_zhiping',
});

export const mysql = (sql,values) => {
  return new Promise((resolve,reject) => {
    pool.getConnection((err, connection) => {
      if(err) {
        reject(err)
      } else {
        connection.query(sql,values, (err, rows) => {
          err ? reject(err) : resolve(rows);
          // 结束会话
          connection.release()
        })
      }
    });
  })
};