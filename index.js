const express = require("express")
const cors = require("cors")
const { fetchRss } = require("./rss")

const app = express()
app.use(cors())

app.get("/", async (req, res) => {
    let xmlData = await fetchRss()
    res.set("Content-Type", "application/xml")
    res.send(xmlData)
})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})
