// comments controllers
const {getCommentsByArticleId, postComment, deleteComment} = require('./controllers')
// router
const express = require('express')
const router = express.Router()


router.delete('/:comment_id', deleteComment)



module.exports = router

// Gather comments controllers for requiring in articles index.js
exports.getCommentsByArticleId = getCommentsByArticleId
exports.postComment = postComment