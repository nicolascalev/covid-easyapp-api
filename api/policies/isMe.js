// policies/isMe.js
module.exports = async function (req, res, proceed) {
    var id = req.param('id');
    try {
        var cvcase = await Case.findOne({ id });
        let payload = await sails.helpers.verifyAccessToken.with({ accessToken: req.param('accessToken') });
        if (cvcase.id != payload.id ) return res.sendStatus(403);
        if (payload) return proceed()
    } catch (err) {
        return res.status(401).json(err);
    }
    return res.sendStatus(401);

};