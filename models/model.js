const db = require("../db/connection");

exports.selectCategories = () => {
  return db.query(`SELECT * FROM categories`).then((data) => {
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
