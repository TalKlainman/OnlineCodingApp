const mongoose = require('mongoose');

const CodeBlockSchema = new mongoose.Schema({
    title: String,
    code: String,
    solution: String,
});

module.exports = mongoose.model('CodeBlock', CodeBlockSchema);