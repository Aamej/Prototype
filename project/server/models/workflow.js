const mongoose = require('mongoose');

const workflowSchema = new mongoose.Schema({
  name: String,
  nodes: [{
    id: String,
    type: String,
    position: {
      x: Number,
      y: Number
    },
    data: mongoose.Schema.Types.Mixed
  }],
  edges: [{
    id: String,
    source: String,
    target: String
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Workflow', workflowSchema);