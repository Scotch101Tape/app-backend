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
    let query
    if (code === CODES.RESTAURANT) {
      query = "halal restaurant"
    } else if (code === CODES.GROCERY) {
      query = "halal grocery"
    } else if (code === CODES.MOSQUE) {
      query = "mosque"
    } else {
      throw "Not yet implemented"
    }

    // I can cache placeIds, will do that later
    client.textSearch({
      params: {
        key: process.env.GOOGLE_MAPS_API_KEY,
        query,
        location
      }
    }).then(({data}) => {
      if (data.status === "OK") {
        res.json(data.results)
      } else {
        throw "Not okay >;("
      }
    })
  } catch(error) {
    console.error(error)
    res.status(400).end()
  }
}
