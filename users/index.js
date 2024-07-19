// users controllers
const {getUsers, getUserByUsername} = require('./controllers')
// routers
const express = require('express')
const router = express.Router()


router.get('/', getUsers)
router.get('/:username', getUserByUsername)



module.exports = router