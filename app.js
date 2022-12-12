const express = require("express");
const { getCategories } = require("./controllers/controller");
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.use((err, req, res, next) => {
  res
    .status(500)
    .send({ msg: "Internal server error: please check sanity of developer" });
});

module.exports = app;
