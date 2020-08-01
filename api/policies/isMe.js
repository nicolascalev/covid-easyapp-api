// policies/isMe.js
module.exports = async function (req, res, proceed) {

    if (!req.headers['authorization']) return res.sendStatus(403)
    const [, accessToken] = req.headers['authorization'].split(' ');
    if (!accessToken) return res.sendStatus(403)

    var id = req.param('id') || req.param('parentid');
    if (!id) return res.status(400).json({ details: 'No id or parentid parameters present in url.' })
    try {
        var cvcase = await Case.findOne({ id });
        let payload = await sails.helpers.verifyAccessToken.with({ accessToken });
        if (cvcase.id != payload.id ) return res.sendStatus(403);
        if (payload) return proceed()
    } catch (err) {
        return res.status(401).json(err);
    }
    return res.sendStatus(401);

};