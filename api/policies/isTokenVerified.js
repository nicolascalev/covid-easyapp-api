// policies/isTokenVerified.js
module.exports = async function (req, res, proceed) {

    if (!req.param('accessToken')) return res.status(403).json()

    try {
        let payload = await sails.helpers.verifyAccessToken.with({ accessToken: req.param('accessToken') });
        if (payload) return proceed()
    } catch (err) {
        return res.status(401).json(err);
    }
    return res.sendStatus(401);

};