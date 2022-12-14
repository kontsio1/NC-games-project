const cors = require('cors');
const express = require("express");
const {handleBadRequestErrors, handleCustomErrors, finalHandleErrors, handleNotFoundErrors, handleWrongPath} = require('./errors/error-handlers')
const { getCategories, getReviews, getReview, getComments, postComment, patchReview, getUsers, getApi} = require("./controllers/controller");
const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/", getApi)

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReview);

app.get("/api/reviews/:review_id/comments", getComments);

app.post("/api/reviews/:review_id/comments", postComment);

app.patch("/api/reviews/:review_id", patchReview)

app.get("/api/users", getUsers)

//to error handling functions
app.get('*', handleWrongPath)

app.use(handleNotFoundErrors)

app.use(handleBadRequestErrors)

app.use(handleCustomErrors)

app.use(finalHandleErrors)

module.exports = app;
