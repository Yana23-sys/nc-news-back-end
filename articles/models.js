const db = require("../db/connection")

exports.selectArticleById = (article_id) => {
    
    return db
    .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, message: 'article does not exist'})
      }
      return result.rows[0]
    })
}

exports.selectArticles = () => {

    return db
    .query(`
        SELECT 
            articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id)::int AS comment_count
        FROM articles 
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY created_at DESC
    ;`)
    .then((result) => {
      return result.rows
    })
}

exports.updateArticle = (article_id, inc_votes) => {

  if (typeof inc_votes !== 'number') {
    return Promise.reject({ status: 400, message: 'Bad request' })
  }

  return db.query(`UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;`, [inc_votes, article_id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, message: 'article not found'})
        }
        return rows[0]
    })
}


