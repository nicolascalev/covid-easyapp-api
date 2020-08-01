/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

    'PUT /login':          'AuthController.login',
    'PUT /getAccessToken': 'AuthController.getAccessToken',

    'GET /stats': 'AuthController.stats'
};
