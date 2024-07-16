const db = require("../db/connection")

exports.selectCommentsByArticleId = (article_id) => {
    
    const queryStr = `
    SELECT comments.* FROM comments 
    JOIN articles 
    ON comments.article_id = articles.article_id 
    WHERE articles.article_id=$1
    ORDER BY created_at ASC
    ;`

    return db.query(queryStr, [article_id]).then(result => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, message: 'not found'})
        }
        return result.rows
    })
}