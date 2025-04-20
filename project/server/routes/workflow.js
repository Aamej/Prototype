const express = require('express');
const router = express.Router();
const workflowController = require('../controllers/workflowController');

router.post('/', workflowController.createWorkflow);
router.get('/', workflowController.getAllWorkflows);
router.put('/:id', workflowController.updateWorkflow);
router.delete('/:id', workflowController.deleteWorkflow);

module.exports = router;