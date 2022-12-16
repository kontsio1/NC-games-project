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
} = require("../models/model");

exports.getCategories = (req, res, next) => {
  selectCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.getReviews = (req, res, next) => {
  const validQueries = ["category", "sort_by", "order"];
  const query = Object.keys(req.query)[0];
  console.log(req.query, query)
  if (query === undefined) {
    selectReviews().then((reviews) => {
      res.status(200).send({ reviews })
    }).catch((err) => {
      next(err);
    });
  } else {
    const validQueryIndex = validQueries.indexOf(query);


    if (validQueryIndex === 0) {
      const selectedCategory = req.query.category;
      selectReviewsByCategory(selectedCategory).then((reviews) => {
        res.status(200).send({ reviews })
      }).catch((err) => {
        next(err);
      });
    } else if (validQueryIndex === 1) {
      const sortColumn = req.query.sort_by;
      sortReviewsByColumn(sortColumn).then((reviews)=>{
        res.status(200).send({ reviews })
      }).catch((err) => {
        next(err);
      });
    } else if (validQueryIndex === 2) {
      sortReviewsOrder()
    } else {
      res.status(400).send({ msg: "Very Bad Request!" });
    }
  }
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
