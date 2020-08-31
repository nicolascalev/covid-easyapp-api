module.exports = {


  friendlyName: 'Update case places',


  description: 'Action to replace case\'s places',


  inputs: {
    places: {
      type: 'string',
      required: true
    }
  },


  exits: {
    success: {
      description: 'The collection was updated successfully'
    },

    failedUpdate: {
      description: 'Collection could not be updated',
      responseType: 'serverError'
    }
  },


  fn: async function (inputs, exits) {

    var places = inputs.places.split(',');
    var parent = this.req.params.id;

    try {
      // this function doesnt return anything so we will return OK
      await Case.replaceCollection(parent, 'places').members(places);
      return exits.success('Places updated!');
    } catch (err) {
      return exits.failedUpdate(err);
    }

  }


};
