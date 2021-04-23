const mysql = require('mysql')
const {dbConfig} = require('../config');
const pool = mysql.createPool(dbConfig);

let query = function( sql, values ) {

  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        console.log( err )
        resolve( err )
      } else {
        console.log('数据库连接成功！！！')
        connection.query(sql, values, ( err, rows) => {
          if ( err ) {
            console.log( err )
            reject( err )
          } else {
            resolve( rows )
          }
          connection.release()
        })
      }
    })
  })
}


module.exports = {
  query
}