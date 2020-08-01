module.exports = {


  friendlyName: 'Verify access token',


  description: 'Gets an access token and verifies if its valid.',


  inputs: {

    accessToken: {
      type: 'string',
      description: 'Token sent from the client',
      required: true
    }
  },


  exits: {

    success: {
      description: 'The accessToken sent from the client is valid',
    },

    badRequest: {
      description: 'Not getting the right parameters'
    },

    tokenExpired: {
      description: 'The token expired some time ago'
    }

  },


  fn: async function (inputs, exits) {
    
    // checks parameters
    if (!inputs.accessToken) throw 'badRequest'

    // requerimos la dependencia y creamos el payload
    const jwt = require('jsonwebtoken')
    try {
      var payload = jwt.verify(inputs.accessToken, sails.config.custom.accessTokenSecret)
      return exits.success(payload)
    } catch (err) {
      throw 'tokenExpired' 
    }
  }


};
