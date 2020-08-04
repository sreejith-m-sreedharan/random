const express = require('express');
const feedbackController = require("../controllers/feedbackController");
const predictController = require("../controllers/predictController");
const router = express.Router();

router.use("/predict", predictController.predict);
router.use("/feedback", feedbackController.feedback);

module.exports = router;