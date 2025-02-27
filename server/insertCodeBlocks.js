require("dotenv").config();
const mongoose = require("mongoose");
const CodeBlock = require("./models/CodeBlock");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
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
  },
];

async function insertData() {
  try {
    await CodeBlock.deleteMany({});
    await CodeBlock.insertMany(codeBlocks);
    console.log("Code blocks inserted successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error inserting code blocks:", error);
    mongoose.connection.close();
  }
}
