// articles controllers
const {getArticleById, getArticles, changeArticle} = require('./controllers')
// comments controllers
const {getCommentsByArticleId, postComment} = require('../comments/controllers')

// router
const express = require('express')
const router = express.Router()



router.get('/:article_id', getArticleById)
router.patch('/:article_id', changeArticle)

router.get('/', getArticles)

// using comments controllers
router.get('/:article_id/comments', getCommentsByArticleId)
router.post('/:article_id/comments', postComment)



// export router (with all controllers) to app.js 
module.exports = router
