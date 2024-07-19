// articles controllers
const {getArticleById, getArticles, changeArticle, postArticle} = require('./controllers')
// comments controllers
const {getCommentsByArticleId, postCommentByArticleId} = require('../comments/controllers')

// router
const express = require('express')
const router = express.Router()



router.get('/:article_id', getArticleById)
router.patch('/:article_id', changeArticle)

router.get('/', getArticles)
router.post('/', postArticle)

// using comments controllers
router.get('/:article_id/comments', getCommentsByArticleId)
router.post('/:article_id/comments', postCommentByArticleId)



// export router (with all controllers) to app.js 
module.exports = router

/*
Routes can be organised further when a particular route accepts different types of HTTP methods by using .route()

router
.route('/:article_id')
.get(getArticleById)
.patch(changeArticle)

*/