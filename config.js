// ADD THIS PART TO YOUR CODE
var config = {}

config.endpoint = "https://nodejscosmos.documents.azure.com:443/";
config.primaryKey = "qDz9RMxilDt5yQjwUGlwPl1CsyQiwoANJe4T4PpBtvzhgTRXul0smbXe4u7HDWU0Iz7pHZuAUpArXYJWT2VyKg==";

config.database = {
   "id": "MynodejsApp"
};

config.container = {
  "id": "MynodejsCollection"
};

config.items = {
    "iijmio": {
        "id": "20181209",
        "volume": "21825MB"
  },
   "Andersen": {
       "id": "Anderson.1",
       "lastName": "Andersen",
       "parents": [{
         "firstName": "Thomas"
     }, {
             "firstName": "Mary Kay"
         }],
     "children": [{
         "firstName": "Henriette Thaulow",
         "gender": "female",
         "grade": 5,
         "pets": [{
             "givenName": "Fluffy"
         }]
     }],
     "address": {
         "state": "WA",
         "county": "King",
         "city": "Seattle"
     }
 },
 "Wakefield": {
     "id": "Wakefield.7",
     "parents": [{
         "familyName": "Wakefield",
         "firstName": "Robin"
     }, {
             "familyName": "Miller",
             "firstName": "Ben"
         }],
     "children": [{
         "familyName": "Merriam",
         "firstName": "Jesse",
         "gender": "female",
         "grade": 8,
         "pets": [{
             "givenName": "Goofy"
         }, {
                 "givenName": "Shadow"
             }]
     }, {
             "familyName": "Miller",
             "firstName": "Lisa",
             "gender": "female",
             "grade": 1
         }],
     "address": {
         "state": "NY",
         "county": "Manhattan",
         "city": "NY"
     },
     "isRegistered": false
   }
};

// ADD THIS PART TO YOUR CODE
module.exports = config;