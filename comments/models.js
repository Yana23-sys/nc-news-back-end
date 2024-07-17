const db = require("../db/connection")
const checkExists = require('../utils/checkExists')

exports.selectCommentsByArticleId = (article_id) => {
    const queryStr = `
    SELECT * FROM comments 
    WHERE article_id=$1
    ORDER BY created_at ASC
    ;`

    return checkExists('articles', 'article_id', article_id).then(() => {
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

    return checkExists('articles', 'article_id', article_id).then(() => {
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
    ;`

    return checkExists('comments', 'comment_id', comment_id).then(() => {
        return db.query(queryStr, [comment_id])
    })
    
}
