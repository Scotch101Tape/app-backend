const {Client} = require("@googlemaps/google-maps-services-js")

const CODES = {
  RESTAURANT: 1,
  GROCERY: 2,
  MOSQUE: 3,
}

const client = new Client()

module.exports = async function findPlaces(req, res) {
  try {
    const {code, location} = req.body
    let initialQuery
    if (code === CODES.RESTAURANT) {
      initialQuery = "halal restaurant"
    } else {
      throw "Not yet implemented"
    }

    // I can cache placeIds, will do that later
    client.textSearch({
      params: {
        query: initialQuery,
        key: process.env.GOOGLE_MAPS_API_KEY,
        location
      }
    }).then(({results}) => {
      res.json(results)
    })
  } catch(error) {
    console.error(error)
    res.status(400).end()
  }
}
