// users controllers
const {getUsers} = require('./controllers')
// routers
const express = require('express')
const router = express.Router()


router.get('/', getUsers)



module.exports = router