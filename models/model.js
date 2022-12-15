const db = require("../db/connection");

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
  return (commentsPromise = db
    .query(
      `SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;`,
      [review_id]
    )
    .then((data) => {
      if (data.rows.length !== 0) {
        return data.rows;
      } else {
        return db
          .query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
          .then((data) => {
            if (data.rows.length === 0) {
              return Promise.reject({
                msg: "Not Valid Review Id",
                status: 404,
              });
            } else {
              return [];
            }
          });
      }
    }));
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
  return db
    .query(
      `INSERT INTO comments (author, review_id, body) VALUES ($1, $2, $3) RETURNING *`,
      [author, review_id, body]
    )
    .then((data) => {
      return data.rows;
    });
};

exports.updateReview = (review_id, patchObject) => {
    const { inc_votes } = patchObject;
    return db
      .query(
        `UPDATE reviews SET votes = votes + $1 WHERE review_id=$2 RETURNING * ;`,
        [inc_votes, review_id]
      )
      .then((data) => {
        if (data.rows.length === 0) {
          return Promise.reject({status:404, msg:"Not Found!"})
        } else {
          return data.rows;
        }
      });
};
exports.selectReviewsByCategory = (category) => {
  return db.query(`SELECT * FROM reviews WHERE category = $1;`,[category]).then((data)=>{
    return data.rows
  })
}

exports.sortReviewsByColumn = (column) => {
  if(column === "") column = 'created_at'
  validColumns = ['review_id','title','category','designer','owner','review_body','review_img_url','created_at','votes']
  if (validColumns.includes(column)) {
  return db.query(`SELECT * FROM reviews ORDER BY ${column} ASC;`).then((data)=>{
    return data.rows
  })
} else {
  return Promise.reject({status:400, msg:"Very Bad Request!"})
}
}