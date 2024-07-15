const express = require("express")
const app = express()
const {psqlErrorHandler, customErrorHandler, serverErrorHandler} = require('./error-handlers')

const {getEndpoints} = require('./endpoints/controllers')
const {getTopics} = require('./topics')
const {getArticleById} = require('./articles')


app.get('/api', getEndpoints)


app.get("/api/topics", getTopics)


app.get('/api/articles/:article_id', getArticleById)


app.all('*', (request, response, next) => {
    response.status(404).send({msg: 'path not found'})
})
  
app.use(psqlErrorHandler)
app.use(customErrorHandler)
app.use(serverErrorHandler)

module.exports = app;