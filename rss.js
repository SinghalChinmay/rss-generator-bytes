const axios = require("axios")
const cheerio = require("cheerio")
const RSS = require("rss")
const fs = require("fs")

function createFeed(data) {
    const feed = new RSS({
        title: "Javascript Bytes",
        description: "Bytes: Your weekly dose of JS",
        author: "Bytes.dev",
        site_url: "https://bytes.dev",
        image_url: "https://bytes.dev/favicon/favicon-32x32.png",
        ttl: 60,
    })
    for (const article of [...data]) {
        feed.item({
            title: article.title,
            url: article.url,
            date: article.pubDate,
        })
    }

    const xml = feed.xml({ indent: true })
    fs.writeFileSync("feed.xml", xml)
}

function scrape(html) {
    const $ = cheerio.load(html)
    const sec_1 = $("section").first()
    const sec_2 = $("section").eq(1)

    let articles = []

    articles.push({
        url: "https://bytes.dev" + sec_1.find("a").attr("href"),
        pubDate: sec_1.find("span").first().text(),
        title: `${sec_1.find("span").eq(1).text()}: ${sec_1.find("p").first().text()}`,
    })

    const archive = sec_2.find("li").slice(0, 5)
    archive.each((i, el) => {
        const anchor = $(el).find("a")
        const link = "https://bytes.dev" + anchor.attr("href")
        articles.push({
            url: link,
            pubDate: $(el).find("span").first().text(),
            title: `${$(el).find("span").eq(1).text()}: ${$(el).find("div").eq(1).text()}`,
        })
    })
    createFeed(articles)
}

function fetchRss() {
    axios.get("https://bytes.dev/archives").then((res) => {
        const data = res.data;
        scrape(data)
    })
}

module.exports = { fetchRss }
