module.exports = {


  friendlyName: 'Sign refresh token',


  description: 'Creates a refresh token that will help to create access tokens',


  inputs: {

    username: {
      type: 'string',
      description: 'This is the username of the client signing a token',
      required: true
    },

    id: {
      type: 'number',
      description: 'This is the id of the client signing a token',
      required: true
    },

  },


  exits: {

    success: {
      description: 'A refresh token was created and sent',
    },

    badRequest: {
      description: 'Not getting the right parameters'
    }

  },


  fn: async function (inputs, exits) {

    // checks parameters
    if (!inputs.username || !inputs.id) throw 'badRequest'

    // requerimos la dependencia y creamos el payload
    const jwt = require('jsonwebtoken');
    var data = { username: inputs.username, id: inputs.id }

    // firmamos un jwt y lo devolvemos
    const refreshToken = jwt.sign(data, sails.config.custom.refreshTokenSecret);
    return exits.success(refreshToken);
  }


};