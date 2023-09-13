require("dotenv").config()
const fs = require("fs")
const express = require("express")
const {Translate} = require("@google-cloud/translate").v2
const {SpeechClient} = require('@google-cloud/speech')

const app = express()
const port = 3000

const translate = new Translate({projectId: process.env.GOOGLE_CLOUD_PROJECT_ID, key: process.env.GOOGLE_TRANSLATE_API_KEY})
const speech = new SpeechClient({projectId: process.env.GOOGLE_CLOUD_PROJECT_ID, key: process.env.GOOGLE_SPEECH_TO_TEXT_API_KEY})

async function translateText({text, target}) {
  const [translation] = await translate.translate(text, target)
  if (typeof (translation) === "string") {
    return translation
  } else {
    throw "something went wrong with the translation"
  }
}

// My low cost security that should stop most people
// Anyone who wants to "hack" this could tho :O
// Please dont, you dont get anything, and it makes me sad
function hasSecretAppKey(req) {
  const secretAppKey = req.header("X_SECRET_APP_KEY")
  return secretAppKey === process.env.SECRET_APP_KEY
}

app.use(express.json())

app.post("/get-translation", async (req, res) => {
  try {
    if (!hasSecretAppKey(req)) {
      throw "secret app key wrong"
    }

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
})

app.post("/get-speech-to-text", async (req, res) => {
  try {
    if (!hasSecretAppKey(req)) {
      throw "secret app key wrong"
    }

    /*const {audio} = req.body

    const transcription = speech.*/

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
      uri: gcsUri,
    };
    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    };
    const request = {
      audio: audio,
      config: config,
    };

    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(`Transcription: ${transcription}`);





  } catch (error) {
    console.error(error)
    res.status(400).end()
  }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

/*
Audio File Test
*/

const audioFile = fs.readFileSync("./resources/test.mp3")
const audioBytes = audioFile.toString("base64")

const audio = {
  content: audioBytes
}
const config = {
  encoding: "MP3",
  sampleRateHertz: 44100,
  languageCode: "en-US"
}
const request = {
  audio: audio,
  config: config
};

const transcription = speech.recognize(request)
  .then(([response]) => response.results.map(result =>
    result.alternatives[0].transcript).join('\n')
  )
  .then(thing => console.log(thing))
