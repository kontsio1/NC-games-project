const {
  selectCategories,
  selectReviews,
  selectReview,
  insertComment,
  selectComments,
  updateReview,
  selectReviewsByCategory,
  sortReviewsByColumn,
  sortReviewsOrder,
  handleQueries
} = require("../models/model");

exports.getCategories = (req, res, next) => {
  selectCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.getReviews = (req, res, next) => {
  handleQueries(req).then((reviews)=>{
    res.status(200).send({ reviews })
  })
  .catch((err) => {
    next(err);
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

exports.getComments = (req, res, next) => {
  const { review_id } = req.params;
  selectComments(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { review_id } = req.params;
  const author = req.body.username;
  const body = req.body.body;
  insertComment(review_id, author, body)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchReview = (req, res, next) => {
  const { review_id } = req.params;
  updateReview(review_id, req.body)
    .then(([review]) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
