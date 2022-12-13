const express = require("express");
const {
  getCategories,
  getReviews,
  getComments,
} = require("./controllers/controller");
const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getComments);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Very Bad Request!" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.msg !== undefined) {
    res.status(err.status).send({ msg: err.msg });
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error!" });
});

module.exports = app;
