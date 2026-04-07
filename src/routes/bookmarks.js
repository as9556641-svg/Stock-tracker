const express = require("express");

const Bookmark = require("../models/Bookmark");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user.id }).sort({
      createdAt: -1
    });

    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookmarks" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, url, category } = req.body;

    if (!title || !url || !category) {
      return res.status(400).json({ message: "Title, URL, and category are required" });
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (error) {
      return res.status(400).json({ message: "Please enter a valid URL" });
    }

    const bookmark = await Bookmark.create({
      user: req.user.id,
      title,
      url: parsedUrl.toString(),
      category
    });

    res.status(201).json(bookmark);
  } catch (error) {
    res.status(500).json({ message: "Failed to create bookmark" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    await bookmark.deleteOne();

    res.json({ message: "Bookmark deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete bookmark" });
  }
});

module.exports = router;

