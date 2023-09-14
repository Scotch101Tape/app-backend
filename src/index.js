require("dotenv").config()
const express = require("express")
const translate = require('./translate.js')
const findPlaces = require("./find-places.js")

const app = express()
const port = 3000

// Mid security
function hasSecretAppKey(req, res, next) {
  const secretAppKey = req.header("X_SECRET_APP_KEY")
  if (secretAppKey === process.env.SECRET_APP_KEY) {
    next()
  } else {
    res.status(400).end()
  }
}

app.use(hasSecretAppKey)
app.use(express.json())

app.get("/hello", (req, res) => res.send("hi"))
app.post("/translate", translate)
app.post("/find-places", findPlaces)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
