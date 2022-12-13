const express = require("express");
const {
  getCategories,
  getReviews,
  getComments,
} = require("./controllers/controller");
const {handleBadRequestErrors, handleCustomErrors, finalHandleErrors} = require('./errors/error-handlers')
const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getComments);

app.use(handleBadRequestErrors)

app.use(handleCustomErrors)

app.use(finalHandleErrors)

module.exports = app;