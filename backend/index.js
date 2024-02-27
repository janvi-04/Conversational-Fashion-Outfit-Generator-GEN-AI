import { Configuration, OpenAIApi } from "openai";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import readline from "readline";

const app = express();
const port = 8000;
app.use(bodyParser.json());
app.use(cors());

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

// Function to get user input from the terminal
const getUserInput = async (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

let selectedUser = "";

// Ask for user input to select a user
const selectUser = async () => {
  selectedUser = await getUserInput("Select user (1 for Mohit or 2 for Janvi): ");
};

// Call the function to select user once the server starts
selectUser();

const systemMessage = "you are an AI fashion outfit generator, you need to recommend outfits by politely interacting with the user. Make sure to say namaste and welcome to Flipkart to every user who interacts once.";

app.post("/", async (request, response) => {
  const { chats } = request.body;

  const userKey = selectedUser === "2" ? "user2" : "user1";
  const currentUser = userProfiles[userKey];

  // Generate preferences string using user data
  const preferences = `The user you are interacting with is ${currentUser.name}. ${currentUser.sex === "male" ? "He" : "She"} is ${currentUser.age} years old, wears ${currentUser.size} size clothing, and ${currentUser.sex === "male" ? "he" : "she"} prefers ${currentUser.preference}.`;

  const result = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: systemMessage + " " + preferences,
      },
      ...chats,
    ],
  });

  response.json({
    output: result.data.choices[0].message,
  });
});

// Static user database
const userProfiles = {
  user1: {
    name: "Mohit",
    sex: "male",
    age: 30,
    size: "XXXL",
    preference: "only wearing red color formals and nothing else",
  },
  user2: {
    name: "Janvi",
    sex: "female",
    age: 28,
    size: "XS",
    preference: "casual wear with vibrant colors but hates pink",
  },
  // Add more user profiles as needed
};

// Statically typed product database with keywords and images
const productDatabase = [
  {
    name: "Stylish Summer Dress",
    keywords: ["summer", "dress", "stylish", "fashion"],
    images: [
      "https://imgs.search.brave.com/9Vn_cGbSpaIWkr-gY4jaw-HOY_Am-e4ThMQ83XsAxZA/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFPNk1WT2ZSekwu/anBn",
      "https://imgs.search.brave.com/u_7WpKjKqGSvBDPDL3J-vvOUacAiOA2KIT6jEFCiwDQ/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nbGFtb3VyLmNv/bS9waG90b3MvNjQ2/YmI1N2NhYTM2NmRi/YjVmNDFmOTBjL21h/c3Rlci93XzE2MDAs/Y19saW1pdC8xNDkw/MjUwNTA0.jpeg",
      "https://imgs.search.brave.com/gB-D74m3IrCIt0jgJjvJiSMI1cyZyU9Hb07Q89vkoSM/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pNS53/YWxtYXJ0aW1hZ2Vz/LmNvbS9hc3IvNGI2/ZmQ4M2EtY2E4NS00/ZDMyLTk0ODEtYWRh/ZTVlNGUxZjc1Ljk4/ZmU3NTYyODIyMWJh/YzAxNzc5ODFjZjJl/MDcyMzFmLmpwZWc_/b2RuSGVpZ2h0PTc4/NCZvZG5XaWR0aD01/ODAmb2RuQmc9RkZG/RkZG"
      // Add more image URLs for this product
    ],
  },
  {
    name: "Casual Denim Jeans",
    keywords: ["denim", "jeans", "casual", "fashion"],
    images: [
      "https://imgs.search.brave.com/SI7aROv-7MiBB8Q6WDD6o0Rhu7QcgJTfLxjPwD0RvNA/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/ODFMTmY0OW5Ndkwu/anBn",
      "https://imgs.search.brave.com/7sVpmjxygh8_YXJIcJdC0JUrQiwTAU8Zdft9f5xsDbM/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEz/MjE1NDM3Ny9waG90/by9qZWFucy5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9VDNL/MV9QZGxaeFhJTEtG/dkdrVG1QaUlmNU0y/RWRJeGtxYTc5QUpU/X3cwWT0",
      "https://imgs.search.brave.com/aV7EsbpBA8a79tp83V2lUkFP5vF4bcsx09Isv18zXyg/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE2/Mjk4MzY3NjA1ODAt/OGI0NWRkZWFlNzJm/P2l4bGliPXJiLTQu/MC4zJml4aWQ9TTN3/eE1qQTNmREI4TUh4/elpXRnlZMmg4TVRk/OGZHUmxibWx0ZkdW/dWZEQjhmREI4Zkh3/dyZ3PTEwMDAmcT04/MA.jpeg",
      "https://imgs.search.brave.com/cOjtgLC1I1dBF5aMynKr_tIito6lhDm1AW_FPBbkXJ8/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMudm9ndWUuY29t/L3Bob3Rvcy82MDgz/MjQ2YzAyNDcyMzEx/OGI5OTNmN2IvNDoz/L3dfMjU2MCxjX2xp/bWl0L1NMJTIwUCUy/MDUuanBlZw"
      // Add more image URLs for this product
    ],
  },
  // Add more products with keywords and images
];

app.post("/generate-outfit", async (request, response) => {
  const { chats, generateKeywords } = request.body;

  let messages = [
    {
      role: "system",
      content: "you are an AI fashion outfit generator. Recommend outfits by politely interacting with the user. Make sure to greet users and provide recommendations based on their preferences. ",
    },
    ...chats,
  ];

  if (generateKeywords) {
    messages.unshift({
      role: "system",
      content: "you are a fashion keyword generator. Provide keywords related to fashion based on the given input.",
    });
  }

  const result = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
  });

  const generatedOutput = result.data.choices[0].message.content;

  // Find matching products and keywords
  const matchingProducts = findMatchingProducts(generatedOutput);

  // Attach image URLs to matching products
  const matchingProductsWithImages = matchingProducts.map(productName => {
    const product = productDatabase.find(p => p.name === productName);
    return {
      name: product.name,
      images: product.images,
    };
  });

  // Display keywords and matching products in the terminal
  console.log("Generated Keywords:", generatedOutput);
  console.log("Matching Products:", matchingProductsWithImages);

  // Send generatedOutput and matchingProducts to the frontend
  response.json({
    output: result.data.choices[0].message,
    matchingProducts: matchingProductsWithImages,
  });
});

function findMatchingProducts(keywords) {
  const matchingProducts = [];

  // Search product database for products with matching keywords
  for (const product of productDatabase) {
    const match = product.keywords.some(keyword => keywords.includes(keyword));
    if (match) {
      matchingProducts.push(product.name);
    }
  }

  return matchingProducts;
}

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
