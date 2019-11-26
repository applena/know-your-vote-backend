const superagent = require('superagent');

function searchGoogleCivic(address){
  let newAddress = encodeURI(address);
  
  let URL = `https://www.googleapis.com/civicinfo/v2/representatives?key=${process.env.GOOGLE_CIVIC_API_KEY}&address=${newAddress}`


  return superagent.get(URL)
    .then(results => {
      return results.body.officials;
    })
}
module.exports = searchGoogleCivic;