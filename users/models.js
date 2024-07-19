const db = require("../db/connection")


exports.selectUsers = () => {
  return db
  .query(`SELECT * FROM users;`)
  .then(({ rows }) => {
    return rows
  })
}

exports.selectUserByUsername = (username) => {

  const queryStr = `SELECT * FROM users WHERE username = $1`

  return db.query(queryStr, [username]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: 'user not found'})
    }
    return rows[0]
  })
}
