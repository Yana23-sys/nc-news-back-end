// comments controllers
const { deleteComment, changeComment} = require('./controllers')
// router
const express = require('express')
const router = express.Router()


router.delete('/:comment_id', deleteComment)
router.patch('/:comment_id', changeComment)



module.exports = router

