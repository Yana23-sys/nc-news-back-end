const db = require('../db/connection')
const format = require('pg-format')

checkExists = (tableName, columnName, columnValue) => {
    const queryStr = format(`SELECT * FROM %I WHERE %I = $1;`, tableName, columnName)

    return db.query( queryStr, [columnValue] )
    .then(({ rows }) => {
        if (rows.length === 0) {
            return false
        } 
        return true
    })
}

module.exports = checkExists


//  return db.query(
//     `SELECT * FROM ${tableName} WHERE ${columnName} = $1;`, [columnValue]  )
//   .then(result => {
//       if (result.rows.length === 0) {
//           return Promise.reject({ status: 404, message: "article not found" })
//       }
//   })