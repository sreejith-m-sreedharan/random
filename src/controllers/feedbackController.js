const engine = require("../services/engine");

module.exports.feedback = function (req, res, next) {
  const mode = req.query.mode;
  let feedback = req.query.feedback;
  const userId = req.query.userId || 0;
  console.log(req.query);
  feedback = Buffer.from(
    decodeURIComponent(feedback || "") || "",
    "base64"
  ).toString("ascii");
  const response = engine().feedback(mode, feedback, userId);
  return res.json(response);
};
