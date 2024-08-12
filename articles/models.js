const db = require("../db/connection")
const checkExists = require('../utils/checkExists')

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

exports.selectArticles = (topic, sort_by = 'created_at', order = 'desc', limit = 10, p = 1, searchQuery = '') => {

  const validSortBy = ['title', 'topic', 'author', 'body', 'created_at', 'votes', 'comment_count']
  const validOrder = ['asc', 'desc']

  // Validate sort_by and order
  if (sort_by && !validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, message: 'invalid sort_by query'})
  }
  if (order && !validOrder.includes(order)) {
    return Promise.reject({ status: 400, message: 'invalid order query'})
  }

  // Build the query string
  let queryStr = `
    SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url, 
    COUNT(comments.article_id)::int AS comment_count
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id
  `

  const queryValues = [ limit, (p - 1) * limit ]
  if (topic && !searchQuery) {
    queryStr += `WHERE topic=$3`
    queryValues.push(topic)
  } else if (!topic && searchQuery) {
    queryStr += `WHERE to_tsvector('english', title) @@ plainto_tsquery('english', $3)`
    queryValues.push(searchQuery)
  } else if (topic && searchQuery) {
    queryStr += `WHERE to_tsvector('english', title) @@ plainto_tsquery('english', $3) AND topic=$4`
    queryValues.push(searchQuery, topic)
  }


  queryStr += `
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order}
    LIMIT $1 OFFSET $2
    ;`

  const queriesPromisesArr = [
    db.query(queryStr, queryValues), 
    getTotalArticleCount(topic, searchQuery) 
  ]

  if (topic) queriesPromisesArr.push(checkExists('topics', 'slug', topic))
  
  return Promise.all(queriesPromisesArr)
  .then(([ articleResult, total_count, topicResult ]) => {

    if (articleResult.rows.length === 0 && !topicResult) {
      return Promise.reject({ status: 404, message: `not found` }) 
    }
    return { articles: articleResult.rows, total_count }
  })
}

const getTotalArticleCount = (topic, searchQuery) => {

  let queryStr = `SELECT COUNT(*)::int FROM articles `
  const queryValues = []


  if (topic && !searchQuery) {
    queryStr += `WHERE topic=$1`
    queryValues.push(topic)
  } else if (!topic && searchQuery) {
    queryStr += `WHERE to_tsvector('english', title) @@ plainto_tsquery('english', $1)`
    queryValues.push(searchQuery)
  } else if (topic && searchQuery) {
    queryStr += `WHERE to_tsvector('english', title) @@ plainto_tsquery('english', $1) AND topic=$2`
    queryValues.push(searchQuery, topic)
  }

  return db.query(queryStr, queryValues)
  .then(({ rows }) => {
    return rows[0].count
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

exports.insertArticle = ( title, topic, author, body, article_img_url ) => {

  const imgUrl = article_img_url || 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'


  let queryStr = `
    INSERT INTO articles (title, topic, author, body, article_img_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *, 0 AS comment_count
  ;`

  const queryValues = [title, topic, author, body, imgUrl]

  // check if topic and author exist
  const promisesArr = [ checkExists('topics', 'slug', topic), checkExists('users', 'username', author) ]

  return Promise.all(promisesArr).then( results => {
    if (results.includes(false)) {
      return Promise.reject({ status: 400, message: `Bad request` }) 
    } else {
      return db.query(queryStr, queryValues).then(({ rows }) => {
        return rows[0]
      })
    }
  }) 
}

