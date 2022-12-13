const db = require("../db/connection");
const { commentData } = require("../db/data/test-data");

exports.selectCategories = () => {
  return db.query(`SELECT * FROM categories`).then((data) => {
    return data.rows;
  });
};

exports.selectReviews = () => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comment_id) AS comment_count
                    FROM comments
                    RIGHT OUTER JOIN reviews 
                    ON comments.review_id = reviews.review_id
                    GROUP BY reviews.review_id
                    ORDER BY created_at DESC;`
    )
    .then((data) => {
      data.rows.forEach((review) => {
        review.comment_count = parseInt(review.comment_count);
      });
      return data.rows;
    });
};

exports.selectComments = (review_id) => {
  return db
  .query(`SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC`, [review_id])
  .then((data) => {
    if (data.rows.length !== 0) {
      return data.rows;
    } else {
        return Promise.reject({ msg: "Not Valid Review Id", status: 404 });
      }
    });
};
