const {
  selectCategories,
  selectReviews,
  selectReview,
  insertComment,
} = require("../models/model");

exports.getCategories = (req, res, next) => {
  selectCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.getReviews = (req, res, next) => {
  selectReviews().then((reviews) => {
    res.status(200).send({ reviews });
  });
};

exports.getReview = (req, res, next) => {
  const { review_id } = req.params;
  selectReview(review_id)
    .then(([review]) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const {review_id} = req.params
  const author = req.body.username
  const body = req.body.body
  console.log(author, review_id, body)
  insertComment(review_id, author, body).then(([comment]) => {
    console.log(comment)
    res.status(201).send({comment})
  });
};
