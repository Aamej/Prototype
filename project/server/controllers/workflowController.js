const Workflow = require('../models/workflow');

// Validate workflow data
const validateWorkflow = (workflow) => {
  const errors = [];
  
  if (!workflow.name) {
    errors.push('Workflow name is required');
  }
  
  // Check if there's at least one trigger node
  const hasTrigger = workflow.nodes && workflow.nodes.some(node => node.type === 'trigger');
  if (!hasTrigger) {
    errors.push('Workflow must have at least one trigger node');
  }
  
  // Check if there's at least one action node
  const hasAction = workflow.nodes && workflow.nodes.some(node => node.type === 'action');
  if (!hasAction) {
    errors.push('Workflow must have at least one action node');
  }
  
  return errors;
};

exports.createWorkflow = async (req, res) => {
  try {
    // Validate workflow data
    const errors = validateWorkflow(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    const workflow = new Workflow(req.body);
    await workflow.save();
    res.status(201).json(workflow);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllWorkflows = async (req, res) => {
  try {
    // If user ID is provided, filter by user
    const query = req.query.userId ? { userId: req.query.userId } : {};
    const workflows = await Workflow.find(query).sort({ updatedAt: -1 });
    res.json(workflows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWorkflowById = async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    res.json(workflow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateWorkflow = async (req, res) => {
  try {
    // Validate workflow data
    const errors = validateWorkflow(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    const workflow = await Workflow.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    
    res.json(workflow);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteWorkflow = async (req, res) => {
  try {
    const workflow = await Workflow.findByIdAndDelete(req.params.id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    res.json({ message: 'Workflow deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.toggleWorkflowStatus = async (req, res) => {
  try {
    const workflow = await Workflow.findById(req.params.id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    
    workflow.isActive = !workflow.isActive;
    await workflow.save();
    
    res.json({ 
      message: `Workflow ${workflow.isActive ? 'activated' : 'deactivated'} successfully`,
      isActive: workflow.isActive
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};