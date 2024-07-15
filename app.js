const express = require("express")
const app = express()
const {getTopics} = require('./topics')

app.use(express.json())



app.get("/api/topics", getTopics)




module.exports = app;