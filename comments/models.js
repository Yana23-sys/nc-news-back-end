const db = require("../db/connection")
const checkExists = require('../utils/checkExists')

exports.selectCommentsByArticleId = (article_id) => {
    const queryStr = `
    SELECT * FROM comments 
    WHERE article_id=$1
    ORDER BY created_at ASC
    ;`

    return checkExists('articles', 'article_id', article_id)
    .then((exists) => {
        if (!exists) {
            return Promise.reject({ status: 404, message: `Resource not found` })
        }
        return db.query(queryStr, [article_id]).then(result => {
            if (result.rows.length === 0) {
                return []
            }
            return result.rows
        })
    })
} 

exports.insertCommentByArticleId = (username, body, article_id) => {
    const queryStr = `
    INSERT INTO comments (body, article_id, author) 
    VALUES ($1, $2, $3) 
    RETURNING *
    ;`

    return checkExists('articles', 'article_id', article_id)
    .then((exists) => {
        if (!exists) {
            return Promise.reject({ status: 404, message: `Resource not found` })
        }
        return db.query(queryStr, [body, article_id, username])
        .then(({ rows }) => {
            return rows[0]
        })
    })
    
}

exports.removeCommentById = (comment_id) => {
    const queryStr = `
        DELETE FROM comments
        WHERE comment_id = $1
        RETURNING*
    ;`
    return db.query(queryStr, [comment_id]).then(({ rows }) => {
        if (rows.length === 0 ) {
            return Promise.reject({ status: 404, message: `Resource not found` })
        }
    })
}

exports.updateComment = (comment_id, inc_votes) => {

    if (typeof inc_votes !== 'number') {
      return Promise.reject({ status: 400, message: 'Bad request' })
    }

    const queryStr = `
    UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *
    ;`

    return db.query(queryStr, [inc_votes, comment_id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, message: 'comment not found'})
        }
        return rows[0]
    })
  }
