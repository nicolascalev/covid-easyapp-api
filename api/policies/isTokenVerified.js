// policies/isTokenVerified.js
module.exports = async function (req, res, proceed) {

    if (!req.headers['authorization']) return res.sendStatus(403)
    const [, accessToken] = req.headers['authorization'].split(' ');
    if (!accessToken) return res.sendStatus(403)

    try {
        let payload = await sails.helpers.verifyAccessToken.with({ accessToken: accessToken });
        if (payload) return proceed()
    } catch (err) {
        return res.status(401).json(err);
    }
    return res.sendStatus(401);

};