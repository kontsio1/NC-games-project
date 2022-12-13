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

exports.selectReview = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then((data) => {
      if (data.rows.length === 1) {
        return data.rows;
      } else {
        return Promise.reject({ msg: "Not Found!", status: 404 });
      }
    });
};

exports.insertComment = (review_id, author, body) => {
  return db.query(`INSERT INTO comments (author, review_id, body) VALUES ($1, $2, $3) RETURNING *`, [author, review_id, body]).then((data)=>{
    return data.rows
  })
};