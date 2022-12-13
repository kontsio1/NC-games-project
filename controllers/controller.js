const {
  selectCategories,
  selectReviews,
  selectReview,
  selectComments
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

exports.getComments = (req, res, next) => {
  const {review_id} = req.params
  selectComments(review_id).then((comments)=>{
    res.status(200).send({comments})
  })
  .catch((err)=>{
    next(err)
  })
}