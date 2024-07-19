// topics controllers
const {getTopics} = require('./controllers')
// router
const express = require('express')
const router = express.Router()


router.get('/', getTopics)


module.exports = router