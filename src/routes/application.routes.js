const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

router.post('/', applicationController.create);
router.get('/', applicationController.getAll);
router.put('/:id/status', applicationController.updateStatus);

module.exports = router;