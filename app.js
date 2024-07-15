const express = require("express")
const app = express()
const {getTopics} = require('./topics')
const {serverErrorHandler} = require('./error-handlers')

app.use(express.json())



app.get("/api/topics", getTopics)


app.all('*', (request, response, next) => {
    response.status(404).send({msg: 'path not found'})
})
  
app.use(serverErrorHandler)

module.exports = app;