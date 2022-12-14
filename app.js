const express = require("express");
const {handleBadRequestErrors, handleCustomErrors, finalHandleErrors} = require('./errors/error-handlers')
const { getCategories, getReviews, getReview, getComments, postComment } = require("./controllers/controller");
const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReview);

app.get("/api/reviews/:review_id/comments", getComments);

app.post("/api/reviews/:review_id/comments", postComment);

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === '23502') {
    res.status(400).send({ msg: "Very Bad Request!" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
    if (err.code === '23503') {
      res.status(404).send({ msg: "Not found!" });
    } else {
      next(err);
    }
  });

app.use((err, req, res, next) => {
  if (err.msg !== undefined) {
    res.status(err.status).send({ msg: err.msg });
  }
});

app.use(handleBadRequestErrors)

app.use(handleCustomErrors)

app.use(finalHandleErrors)

module.exports = app;
