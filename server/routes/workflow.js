const express = require('express');
const router = express.Router();
const workflowController = require('../controllers/workflowController');

// Create a new workflow
router.post('/', workflowController.createWorkflow);

// Get all workflows
router.get('/', workflowController.getAllWorkflows);

// Get a specific workflow by ID
router.get('/:id', workflowController.getWorkflowById);

// Update a workflow
router.put('/:id', workflowController.updateWorkflow);

// Delete a workflow
router.delete('/:id', workflowController.deleteWorkflow);

// Toggle workflow active status
router.patch('/:id/toggle', workflowController.toggleWorkflowStatus);

module.exports = router;