const express = require("express");
const {handleBadRequestErrors, handleCustomErrors, finalHandleErrors} = require('./errors/error-handlers')
const { getCategories, getReviews, getReview, getComments } = require("./controllers/controller");
const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReview);

app.get("/api/reviews/:review_id/comments", getComments);

app.use(handleBadRequestErrors)

app.use(handleCustomErrors)

app.use(finalHandleErrors)

module.exports = app;