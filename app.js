const express = require("express")
const app = express()
const {getTopics} = require('./topics')
const {serverErrorHandler} = require('./error-handlers')
const endpoints = require('./endpoints.json')

app.use(express.json())

app.get('/api', (request, response, next) => {
    response.status(200).send({endpoints})
})

app.get("/api/topics", getTopics)


app.all('*', (request, response, next) => {
    response.status(404).send({msg: 'path not found'})
})
  
app.use(serverErrorHandler)

module.exports = app;