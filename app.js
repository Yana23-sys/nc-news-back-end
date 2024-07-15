const express = require("express")
const app = express()
const {getTopics} = require('./topics')
const {serverErrorHandler} = require('./error-handlers')
const {getEndpoints} = require('./endpoints/controllers')


app.get('/api', getEndpoints)

app.get("/api/topics", getTopics)


app.all('*', (request, response, next) => {
    response.status(404).send({msg: 'path not found'})
})
  
app.use(serverErrorHandler)

module.exports = app;