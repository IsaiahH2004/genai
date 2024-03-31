import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose, { isValidObjectId } from "mongoose";

dotenv.config();

await mongoose
  .connect(process.env.MONGO_URL || "mongodb://localhost:27017")
  .then(() => {
    console.log(
      "connected to:",
      process.env.MONGO_URL || "mongodb://localhost:27017",
    );
  });

import { User, Item } from "./models/models.js";
import { VertexAI } from "@google-cloud/vertexai";

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(cors());

// Image sent in body
app.post("/steps/get", async (req, res) => {
  const { image, userId } = await req.body;

  console.log("here", userId)
  try {
    const vertex_ai = new VertexAI({
      project: process.env.PROJECT_ID,
      location: "us-central1",
    });
    const generativeVisionModel = vertex_ai.getGenerativeModel({
      model: "gemini-1.0-pro-vision",
    });

    const filePart = {
      inline_data: { data: image.base64, mime_type: "image/jpeg" },
    };
    const textPart = {
      text: "I am trying to trying to dispose of the item in this image in the most sustainable way. Please provide me with a very concise step by step procedure, where each step is delimited by a semicolon. Make the first thing step the name of object you see in the image.",
    };
    const request = {
      contents: [{ role: "user", parts: [textPart, filePart] }],
    };

    const resp = await generativeVisionModel.generateContentStream(request);
    const contentResponse = await resp.response;
    const splitted =
      contentResponse.candidates[0].content.parts[0].text.split(";");

    const item = new Item({
      name: splitted[0].trim(),
      steps: splitted.slice(1).map((e) => {
        return {
          description: e.trim(),
          isComplete: false,
        };
      }),
      userId: userId,
      isComplete: false
    });
    await item.save();

    console.log(item);
    res.json({
      response: item._id,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      error: "Failed to process image: " + e,
    });
  }
});

// body: { name: "string" }
app.post("/register", async (req, res) => {
  const { name } = await req.body;
  console.log(name);
  if (!name) {
    return res.status(400).json({
      error: "Please send the name to register",
    });
  }

  try {
    const user = new User({ name, highScore: 0 });
    await user.save();
    res.json({
      response: `${user._id}`,
    });
  } catch (e) {
    res.status(500).json({
      error: `Failed to register with error: ${e}`,
    });
  }
});

app.get("/items/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId)) {
    return res.status(400).json({
      error: "Please send a valid object ID",
    });
  }

  try {
    const items = await Item.find({
      userId: new mongoose.mongo.ObjectId(userId),
    });
    if (!items || items.length == 0) {
      return res.status(404).json({
        error: "No items belonging to this user",
      });
    }

    res.json({
      response: items,
    });
  } catch (e) {
    res.status(500).json({
      error: `Failed to find items with error: ${e}`,
    });
  }
});

app.get("/item/:itemId", async (req, res) => {
  const { itemId } = req.params;
  if (!isValidObjectId(itemId)) {
    return res.status(400).json({
      error: "Please send a valid object ID",
    });
  }

  try {
    const item = await Item.findOne({
      _id: new mongoose.mongo.ObjectId(itemId),
    });
    if (!item) {
      return res.status(404).json({
        error: "No item with this id",
      });
    }

    res.json({
      response: item,
    });
  } catch (e) {
    res.status(500).json({
      error: `Failed to find item with error: ${e}`,
    });
  }
});

app.patch("/item/:itemId/toggle/:stepNum", async (req, res) => {
  const { itemId, stepNum } = req.params;
  if (!isValidObjectId(itemId)) {
    return res.status(400).json({
      error: "Please send a valid object ID",
    });
  }

  try {
    const item = await Item.findOne({
      _id: new mongoose.mongo.ObjectId(itemId),
    });
    if (!item) {
      return res.status(404).json({
        error: "No item with this id",
      });
    }

    await item.updateOne({
      $set: {
        [`steps.${stepNum}.isComplete`]: !item.steps[stepNum].isComplete,
      },
    });

    res.json({
      response: `Successfullly toggled status of step 2 ${stepNum} of item ${itemId}`,
    });
  } catch (e) {
    res.status(500).json({
      error: `Failed to update item with error: ${e}`,
    });
  }
});

app.patch("/complete/:itemId", async (req, res) => {
  const { itemId } = await req.body;
  if (!isValidObjectId(itemId)) {
    return res.status(400).json({
      error: "Please send a valid object ID",
    });
  }
  try {
    const item = await Item.findOneAndUpdate(
      { _id: new mongoose.mongo.ObjectId(itemId) },
      { $set: { isComplete: true } },
    );
    if (!item) {
      return res.status(404).json({
        error: "No item with this id",
      });
    }

    await User.findOneAndUpdate(
      { _id: new mongoose.mongo.ObjectId(item.userId) },
      { $inc: { highScore: 1 } },
    );
  } catch (e) {
    res.status(500).json({
      error: `Failed to mark item as completed with error: ${e}`,
    });
  }
});

app.get("/leaderboard/:N", async (req, res) => {
  const { N } = req.params;

  try {
    const users = await User.find().sort({ highScore: -1 }).limit(N);

    if (!users || users.length == 0) {
      return res.status(404).json({
        error: "No users found.",
      });
    }

    res.json({
      response: users,
    });
  } catch (e) {
    res.status(500).json({
      error: `Failed to get leaderboard with error: ${e}`,
    });
  }
});

app.get("/info/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId)) {
    return res.status(400).json({
      error: "Please send a valid object ID",
    });
  }

  try {
    const user = await User.findOne({
      _id: new mongoose.mongo.ObjectId(userId),
    });
    if (!user) {
      return res.status(404).json({
        error: "Could not find user.",
      });
    }

    const usersWithHigherScores = await User.find({
      highScore: { $gte: user.highScore },
    });

    const placement = usersWithHigherScores.length;

    res.json({
      response: {
        name: user.name,
        highScore: user.highScore,
        placement: placement,
      },
    });
  } catch (e) {
    res.status(500).json({
      error: `Failed to get user info with error: ${e}`,
    });
  }
});

app.listen(process.env.PORT || 8000);
