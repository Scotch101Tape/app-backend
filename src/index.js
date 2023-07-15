require("dotenv").config()
const express = require("express")
const {Translate} = require("@google-cloud/translate").v2

const app = express()
const port = 3000

const translate = new Translate({projectId: process.env.GOOGLE_CLOUD_PROJECT_ID, key: process.env.GOOGLE_TRANSLATE_API_KEY})

async function translateText({text, target}) {
  const [translation] = await translate.translate(text, target)
  if (typeof(translation) === "string") {
    return translation
  } else {
    throw "something went wrong with the translation"
  }
}

app.use(express.json())

app.post("/get-translation", (req, res) => {
  new Promise((resolve, _reject) => resolve(req))
    .then(req => {
      // My low cost security that should stop most people
      // Anyone who wants to "hack" this could tho :O
      // Please dont, you dont get anything, and it makes me sad
      const secretAppKey = req.header("X-SECRET-APP-KEY")
      if (secretAppKey === process.env.SECRET_APP_KEY) {
        return req
      } else {
        throw "secret api key wrong"
      }
    })
    .then(req => {
      const {text, target} = req.body
      if (target === "en" || target === "ar") {
        return {text, target}
      } else {
        throw "target not arabic or english"
      }
    })
    .then(({text, target}) => translateText({text, target}))
    .then(translation => {
      console.log(translation)
      res.status(200).json({translation}).end()
    })
    .catch(_err => console.log(_err) && res.status(400).end())
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
