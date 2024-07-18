const db = require("../db/connection")

exports.selectArticleById = (article_id) => {
    
  let queryStr = `
    SELECT articles.*, COUNT(comments.article_id)::int AS comment_count
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id=$1
    GROUP BY articles.article_id;
  `
  return db
    .query(queryStr, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: 'article does not exist'})
      }
      return rows[0]
    })    
}

exports.selectArticles = (topic, sort_by = 'created_at', order = 'desc') => {

  const validSortBy = ['title', 'topic', 'author', 'body', 'created_at', 'votes']
  const validOrder = ['asc', 'desc']
  const queryValues = []


  if (sort_by && !validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, message: 'invalid query'})
  }
  if (order && !validOrder.includes(order)) {
    return Promise.reject({ status: 400, message: 'invalid query'})
  }

  let queryStr = `
    SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url, 
    COUNT(comments.article_id)::int AS comment_count
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id
  `

  if (topic) {
    queryStr += `WHERE topic=$1`
    queryValues.push(topic)
  }

  queryStr += `
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order};
  `

  return db.query(queryStr, queryValues)
  .then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: 'not found'})
    }
    return rows
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


