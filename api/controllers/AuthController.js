/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {

  /**
   * `AuthController.signup()`
   */
  signup: async function (req, res) {
    const { username, password, name } = req.allParams();
    if(!username || !password || !name) return res.status(400).json({ details: 'You have to provide username, password and name' })

    // validate that user doesn´t exist
    try {
      var cvcase = await Case.findOne({ username });
      if(cvcase) return res.status(400).json({ details: 'There is a user with that username already' })
    } catch (err) {
      return res.status(500).json(err);
    }

    // if there is no user w thar username then create it
    try {
      var cvcase = await Case.create({ username, password, name }).fetch();
      return res.status(200).json(cvcase)
    } catch (err) {
      return res.status(500).json(err)
    }
  },

  /**
   * `AuthController.login()`
   */
  login: async function (req, res) {
    try {
      const { username, password } = req.allParams();
      if (!username || !password)
        return res.status(400).json({ details: 'You need to provide a username and password' })

      var cvcase = await Case.findOne({ username }).decrypt();
      if (!cvcase) return res.status(400).json({ details: `There's no user with thar username` });
      if (cvcase.password != password) return res.status(400).json({ details: 'Incorrect password' });
      cvcase = _.omit(cvcase, ['password']);

      let accessToken = await sails.helpers.signAccessToken.with({ username, id: cvcase.id })
      let refreshToken = await sails.helpers.signRefreshToken.with({ username, id: cvcase.id })
      return res.json({ accessToken, refreshToken, cvcase });

    } catch (err) {
      if (err.name == 'UsageError') return res.status(400).json(err);
      return res.status(500).json(err)
    }
  },

  /**
  * `AuthController.getAccessToken()`
  */
  getAccessToken: async function (req, res) {

    // checks if refresh token was sent
    if (!req.headers['authorization']) return res.status(403).json();
    const [, refreshToken] = req.headers['authorization'].split(' ');
    if (!refreshToken) return res.status(403).json();

    // incluye jwt para verificar refresh token
    const jwt = require('jsonwebtoken');
    jwt.verify(refreshToken, sails.config.custom.refreshTokenSecret, async (err, payload) => {
      if (err !== null) return res.status(403).json();
      let accessToken = await sails.helpers.signAccessToken.with({ username: payload.username, id: payload.id })
      return res.json({ accessToken })
    })
  },

  /**
  * `AuthController.stats()`
  */
  stats: async function (req, res) {
    try {
      var stats = {};
      stats.cases = await Case.count();
      stats.places = await Place.count();
      stats.casesLast24Hrs = await Case.count({
        createdAt: { '>' : Date.now() - (24*60*60*1000) }
      }) 
      stats.placesLast24Hrs = await Place.count({
        createdAt: { '>' : Date.now() - (24*60*60*1000) }
      })
      return res.status(200).json(stats)
    } catch (err) {
      return res.status(500).json(err)
    }
  }

};

