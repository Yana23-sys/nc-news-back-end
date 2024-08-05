const express = require("express")
const app = express()
const cors = require('cors')

const {psqlErrorHandler, customErrorHandler, serverErrorHandler} = require('./error-handlers')
const {getEndpoints} = require('./endpoints/controllers')

const topicsRouter = require('./topics')
const articlesRouter = require('./articles')
const commentsRouter = require('./comments')
const usersRouter = require('./users')

app.use(cors())

app.use(express.json())


app.get('/api', getEndpoints)

app.use('/api/topics', topicsRouter)
app.use('/api/articles', articlesRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/users', usersRouter)


app.all('*', (request, response, next) => {
    response.status(404).send({msg: 'path not found'})
})
  
app.use(psqlErrorHandler)
app.use(customErrorHandler)
app.use(serverErrorHandler)

module.exports = app;