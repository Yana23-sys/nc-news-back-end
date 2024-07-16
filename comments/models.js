const db = require("../db/connection")
const checkArticleExists = require('../utils/checkExists')

exports.selectCommentsByArticleId = (article_id) => {
    const queryStr = `
    SELECT * FROM comments 
    WHERE article_id=$1
    ORDER BY created_at ASC
    ;`

    return checkArticleExists(article_id).then(() => {
        return db.query(queryStr, [article_id]).then(result => {
            if (result.rows.length === 0) {
                return []
            }
            return result.rows
        })
    })
} 

exports.insertComment = (username, body, article_id) => {
    const queryStr = `
    INSERT INTO comments (body, article_id, author) 
    VALUES ($1, $2, $3) 
    RETURNING *
    ;`

    return checkArticleExists(article_id).then(() => {
        return db.query(queryStr, [body, article_id, username])
        .then(({ rows }) => {
            return rows[0]
        })
    })
    
}