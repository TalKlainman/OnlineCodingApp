/**
 * Mongoose model for code blocks.
 * Defines the schema and exports the model for database operations.
 * 
 * @module CodeBlock
 */

const mongoose = require("mongoose");

// Define the schema for a code block
const CodeBlockSchema = new mongoose.Schema({
  title: String,
  code: String,
  solution: String,
  hint: String,
});

module.exports = mongoose.model("CodeBlock", CodeBlockSchema);
