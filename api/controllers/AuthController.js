/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {

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

};

