const mongoose = require('mongoose');

const nodeConfigSchema = new mongoose.Schema({
  event: String,
  actionType: String,
  conditionType: String,
  searchQuery: String,
  to: String,
  subject: String,
  // Add more configuration fields as needed
}, { _id: false });

const nodeSchema = new mongoose.Schema({
  id: String,
  type: String,
  position: {
    x: Number,
    y: Number
  },
  data: {
    label: String,
    description: String,
    config: nodeConfigSchema
  }
}, { _id: false });

const edgeSchema = new mongoose.Schema({
  id: String,
  source: String,
  target: String,
  sourceHandle: String,
  targetHandle: String,
  animated: Boolean
}, { _id: false });

const workflowSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  nodes: [nodeSchema],
  edges: [edgeSchema],
  isActive: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updatedAt field before saving
workflowSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Workflow', workflowSchema);