const express = require("express");
const { getCategories, getReviews } = require("./controllers/controller");
const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews)

module.exports = app;