const db = require('../db/connection')

const checkArticleExists = (articleId) => {
    return db.query(
      "SELECT * FROM articles WHERE article_id = $1;", [articleId] )
    .then(result => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, message: "article not found" })
        }
    })
}

module.exports = checkArticleExists