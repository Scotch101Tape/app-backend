const {Translate} = require("@google-cloud/translate").v2

const translate = new Translate({projectId: process.env.GOOGLE_CLOUD_PROJECT_ID, key: process.env.GOOGLE_TRANSLATE_API_KEY})

async function translateText({text, target}) {
  const [translation] = await translate.translate(text, target)
  if (typeof (translation) === "string") {
    return translation
  } else {
    throw "something went wrong with the translation"
  }
}

module.exports = async function translate (req, res) {
  try {
    const {text, target} = req.body
    if (target !== "en" && target !== "ar") {
      throw "target not either arabic or english"
    }

    const translation = await translateText({text, target})
    res.json({translation, text, target})
  } catch (error) {
    console.error(error)
    res.status(400).end()
  }
}
