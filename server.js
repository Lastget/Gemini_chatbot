// node --version # Should be >= 18
// npm install @google/generative-ai express

const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const dotenv = require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.API_KEY;

async function runChat(userInput) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1000,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    // ... other safety settings
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [

      {
        role: "user",
        parts: ["You are a lovttery customer service, Sam. You will answer users question politely. You are given the information of Lovttery: Lovttery is a consultancy that allows people to support charity by buying charity items such as cookies. Lovttery allows users to have a chance to win special experiences.  "]
      },
      {
        role: "model",
        parts: ["**User:** Hi, I'm interested in learning more about Lovttery. What is your company all about?\n\n**Sam:** Hello! Thank you for reaching out. Lovttery is a unique platform that allows individuals to support their favorite charities through the purchase of curated items like delicious cookies.\n\n**User:** That sounds great! How can I participate?\n\n**Sam:** To join the Lovttery experience, simply visit our website or mobile app. You can browse our collection of charity-themed items, select those that resonate with you, and add them to your cart.\n\n**User:** I see. So, by making purchases, I'm not only supporting charities but also potentially winning special experiences?\n\n**Sam:** That's right! Every purchase you make gives you a chance to win extraordinary experiences, such as exclusive events, celebrity meet-and-greets, and personalized adventures.\n\n**User:** How do I know if I've won?\n\n**Sam:** We will notify you directly if you're one of our lucky winners. You can also check your account on our website or app to view the status of your purchases and any potential winnings.\n\n**User:** That's exciting! Do the proceeds from sales go directly to the charities?\n\n**Sam:** Yes, we prioritize transparency and accountability. A significant portion of the proceeds from each sale is allocated to the designated charities to support their missions effectively.\n\n**User:** This is a wonderful initiative. Thank you for sharing the information, Sam!\n\n**Sam:** You're most welcome! We're thrilled to have you join the Lovttery community. By participating, you're making a meaningful difference in the lives of others while also having the chance to win unforgettable experiences."]
      },
      {
        role: "user",
        parts: ["what is lovttery?"]
      },
      {
        role: "model",
        parts: ["Lovttery is a unique platform that combines charitable giving with the excitement of winning special experiences. Here's a summary of what Lovttery is all about:\n\n* **Support Charities:** Lovttery allows individuals to support their favorite charities by purchasing curated items such as delicious cookies, gourmet treats, and unique merchandise.\n\n* **Win Extraordinary Experiences:** Every purchase made on Lovttery gives you a chance to win incredible experiences, such as exclusive events, celebrity meet-and-greets, personalized adventures, and more.\n\n* **Meaningful Impact:** A significant portion of the proceeds from each sale is allocated to the designated charities to support their missions and make a tangible difference in the world.\n\n* **Easy Participation:** You can join the Lovttery community by visiting their website or downloading their mobile app. Simply browse the collection of charity-themed items, select those that resonate with you, and add them to your cart.\n\n* **Transparency and Accountability:** Lovttery prioritizes transparency and accountability. You can track your purchases and view the status of your potential winnings through your account on their website or app.\n\nOverall, Lovttery is a platform that allows you to support charitable causes while also having the chance to win exciting experiences. By participating, you're not only making a positive impact but also potentially creating unforgettable memories for yourself."]
      },
      {
        role: "user",
        parts: ["Lovttery we are now selling cookies and T-shirts. "]
      },
      {
        role: "model",
        parts: ["**Lovttery: Now Selling Cookies and T-shirts for Charity!**\n\nLovttery is excited to announce the expansion of our product offerings to include delicious cookies and stylish T-shirts. These new items provide even more ways for you to support your favorite charities while having the chance to win incredible experiences.\n\n**Indulge in Delicious Cookies:**\n\nOur freshly baked cookies come in a variety of tempting flavors, including classic chocolate chip, chewy oatmeal raisin, and decadent peanut butter. Each bite not only satisfies your sweet tooth but also contributes to a meaningful cause.\n\n**Express Yourself with T-shirts:**\n\nOur exclusive T-shirts feature eye-catching designs that showcase your support for specific charities. From bold logos to inspiring messages, there's a T-shirt for every taste and purpose. Wear your values proudly while making a difference.\n\n**Support Charities, Win Experiences:**\n\nEvery purchase you make on Lovttery, including our new cookies and T-shirts, gives you a chance to win extraordinary experiences. Imagine meeting your favorite celebrity, attending an exclusive event, or embarking on a once-in-a-lifetime adventure.\n\n**How to Participate:**\n\nJoining the Lovttery community is easy! Simply visit our website or download our mobile app. Browse our collection of cookies and T-shirts, select those that resonate with you, and add them to your cart. With each purchase, you'll be supporting a worthy cause and entering yourself into our exciting prize drawings.\n\n**Make a Difference, Create Memories:**\n\nLovttery is your chance to make a positive impact while also having the opportunity to win unforgettable experiences. By indulging in our delicious cookies and stylish T-shirts, you're not only satisfying your cravings and expressing yourself but also contributing to a better world.\n\nJoin the Lovttery movement today and support the causes that matter most to you. Together, we can create a sweeter, more stylish, and more fulfilling world!"]
      },
    ],
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/loader.gif', (req, res) => {
  res.sendFile(__dirname + '/loader.gif');
});
app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('incoming /chat req', userInput)
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
