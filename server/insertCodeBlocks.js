/**
 * Script to insert predefined code blocks into MongoDB.
 * 
 * @module InsertCodeBlocks
 */

require("dotenv").config();
const mongoose = require("mongoose");
const CodeBlock = require("./models/CodeBlock");


// Connect to MongoDB and insert predefined code blocks.
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    insertData();
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });

const codeBlocks = [
  {
    title: "Sum Two Numbers",
    code: `function sum(a, b) {
      return;
    }
    
    console.log(sum(2, 3));`,
    solution: `function sum(a, b) {
      return a + b;
    }
    
    console.log(sum(2, 3));`,
    hint: "Think about how you can combine two numbers into a single result.",
  },
  {
    title: "Convert String to Uppercase",
    code: `function toUpperCase(str) {
      return;
    }
    
    console.log(toUpperCase('hello'));`,
    solution: `function toUpperCase(str) {
      return str.toUpperCase();
    }
    
    console.log(toUpperCase('hello'));`,
    hint: "JavaScript provides a built-in method to modify the case of a string.",
  },
  {
    title: "Check Even or Odd",
    code: `function isEven(num) {
      return === 0 ? 'Even' : 'Odd';
    }
    
    console.log(isEven(7));`,
    solution: `function isEven(num) {
      return num % 2 === 0 ? 'Even' : 'Odd';
    }
    
    console.log(isEven(7));`,
    hint: "Numbers that are evenly divisible by 2 belong to one category, while others belong to another.",
  },
  {
    title: "Loop Through Array",
    code: `function loopArray(arr) {
      for (let i = 0; i < arr.length; i++) {
        console.log();
      }
    }
    
    loopArray([10, 20, 30, 40]);`,
    solution: `function loopArray(arr) {
      for (let i = 0; i < arr.length; i++) {
        console.log(arr[i]);
      }
    }
    
    loopArray([10, 20, 30, 40]);`,
    hint: "Each item in the array has an index. Try accessing items one by one.",
  },
];

async function insertData() {
  try {
    await CodeBlock.deleteMany({}); // Clear existing data
    await CodeBlock.insertMany(codeBlocks);
    mongoose.connection.close();
  } catch (error) {
    console.error("Error inserting code blocks:", error);
    mongoose.connection.close();
  }
}
