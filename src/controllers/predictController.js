const engine = require("../services/engine");

module.exports.predict = function (req, res, next) {
  const mode = req.query.mode;
  const userId = req.query.userId || 0;
  const response = engine().predict(mode, userId);
  console.log(req.query);
  if (response && response.prediction && response.prediction.data) {
    response.prediction.data = Buffer.from(response.prediction.data).toString(
      "base64"
    );
  }
  return res.json(response);
};
