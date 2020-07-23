const engine = require('../services/engine');

module.exports = function (app, router) {

    router.use('/predict', function (req, res, next) {
        const mode = req.query.mode;
        const userId = req.query.userId || 0;
        const response = engine().predict(mode, userId);
        if (response && response.prediction && response.prediction.data) {
            response.prediction.data = Buffer.from(response.prediction.data).toString('base64');
        }
        return res.json(response);
    });
    router.use('/feedback', function (req, res, next) {
        const mode = req.query.mode;
        let feedback = req.query.feedback;
        const userId = req.query.userId || 0;
        feedback = Buffer.from(decodeURIComponent(feedback || "") || "", 'base64').toString('ascii');
        const response = engine().feedback(mode, feedback, userId);
        return res.json(response);
    });
    return router;
}