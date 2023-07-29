const express = require("express")
const cors = require("cors")
const { fetchRss } = require("./rss")

const app = express()
app.use(cors())

app.get("/", (res, req) => {
    fetchRss()
    req.sendFile("feed.xml", { root: __dirname })
})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})
