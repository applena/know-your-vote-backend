'use strict';

const express = require ('express');
require('dotenv').config();
const cors = require('cors');
const uuid = require('uuid/v4');
const searchGoogleCivic = require('./lib/searchGoogleCivic');
const searchOpenSecrets = require('./lib/searchOpenSecrets');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;

app.get('/representatives', getReps);

function getReps(request, response){
  let address = request.query.address;

  let state = request.query.address.split('').splice(request.query.address.length-2).join('').toLowerCase();
  
  const normalReps = {};
  const repsArray = [];

  searchGoogleCivic(address)
    .then(reps => {
      reps.forEach(rep => {
        normalReps[rep.name] = { 
          name: rep.name,
          id: uuid(),
          party: rep.party ? rep.party : 'unknown',
          image_url: rep.photoUrl ? rep.photoUrl : './img/placeholder.png'
        };

        repsArray.push(normalReps[rep.name]);
      })

      searchOpenSecrets(state)
        .then(results => {
          results.forEach(rep => {
            const attributes = rep['@attributes']
            if(!normalReps[attributes.firstlast]) {
              normalReps[attributes.firstlast] = {
                name: attributes.firstlast
              };
              repsArray.push(normalReps[attributes.firstlast]);
            }
            
            normalReps[attributes.firstlast].office = attributes.office;
            normalReps[attributes.firstlast].website = attributes.website;
            normalReps[attributes.firstlast].phone = attributes.phone
          
            console.log(attributes.firstlast, normalReps[attributes.firstlast]);
          })
          console.log(Object.keys(normalReps))
          response.send(repsArray)
        })
      
      

    })
}



app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
})

