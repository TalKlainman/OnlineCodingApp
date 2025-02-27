const express = require("express");
const router = express.Router();
const CodeBlock = require("../models/CodeBlock");

router.get("/", async (req, res) => {
  try {
    const codeBlocks = await CodeBlock.find();
    res.json(codeBlocks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch code blocks" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const codeBlocks = await CodeBlock.findById(req.params.id);
    if (!codeBlocks) {
      return res.status(404).json({ error: "Code block not found" });
    }
    res.json(codeBlocks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch code block" });
  }
});

module.exports = router;
