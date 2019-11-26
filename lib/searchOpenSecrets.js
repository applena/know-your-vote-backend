const superagent = require('superagent');

function searchOpenSecrets(state){
  let URL = `http://www.opensecrets.org/api/?method=getLegislators&id=${state}&apikey=${process.env.OPEN_SECRETS_API_KEY}&output=json`;
  return superagent.get(URL)
    .then(results => {
      const reps = JSON.parse(results.text);
      return reps.response.legislator;
    })
}

module.exports = searchOpenSecrets;