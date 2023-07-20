const asyncHandler = require("express-async-handler");
const Articles = require("../models/articlesModels");
const User = require("../models/userModel");
const fs = require("fs");

const createArticle = asyncHandler(async (req, res) => {
  const { title, picture, category, description } = req.body;
  if (!title || !category || !description) {
    res.status(400).json({ msg: "Please, complete the fields" });
  }

  const article = await Articles.create({
    user: req.user.id,
    title,
    picture,
    category,
    description,
    userName: req.user.name,
  });
  res.status(200).json(article);
});

const getArticles = asyncHandler(async (req, res) => {
  const articles = await Articles.find({ user: req.user.id });
  res.json(articles);
});

const getAllArticles = asyncHandler(async (req, res) => {
  const title = req.query.title;
  const category = req.query.category;

  let posts;
  if (title && category) {
    posts = await Articles.find({ category, title });
  } else if (title) {
    posts = await Articles.find({ title });
  } else if (category) {
    posts = await Articles.find({ category });
  } else {
    posts = await Articles.find();
  }
  res.status(200).json(posts);
});

const lastArticle = asyncHandler(async (req, res) => {
  const article = await Articles.find().limit(2).sort({ $natural: -1 }); //incompleto
  res.json(article);
});

const getPostsByUser = asyncHandler(async (req, res) => {
  const articles = await Articles.find({ userName: req.params.name });
  res.json(articles);
});

const getArticleById = asyncHandler(async (req, res) => {
  const article = await Articles.findById({ _id: req.params.id });
  res.json(article);
});

const deleteArticles = asyncHandler(async (req, res) => {
  const article = await Articles.findById(req.params.id);
  if (!article) {
    res.status(400).json({ msg: `No article with id: ${req.params.id}` });
  }
  if (!req.user) {
    res.status(400).json({ msg: "No user" });
  }
  if (article.user.toString() !== req.user.id) {
    res.status(400).json({ msg: "user not authorized" });
  }
  await article.deleteOne();
  res.status(200).json({ id: req.params.id });
});

const updateArticles = asyncHandler(async (req, res) => {
  const article = await Articles.findById(req.params.id);
  if (!article) {
    res.status(400).json({ msg: `Article: ${req.params.id} doesnt exists` });
  }
  if (!req.user) {
    res.status(400).json({ msg: "User not found" });
  }
  if (article.user.toString() !== req.user.id) {
    res.status(401).json({ msg: "User not authorized" });
  }
  const updatedArticle = await Articles.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res.status(200).json(updatedArticle);
});

module.exports = {
  createArticle,
  getArticles,
  deleteArticles,
  updateArticles,
  getAllArticles,
  getArticleById,
  getPostsByUser,
  lastArticle,
};
