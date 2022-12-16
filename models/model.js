const db = require("../db/connection");

exports.selectCategories = () => {
  return db.query(`SELECT * FROM categories`).then((data) => {
    return data.rows;
  });
};

selectReviews = () => {
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
        return Promise.reject({ status: 404, msg: "Not Found!" });
      } else {
        return data.rows;
      }
    });
};
selectReviewsByCategory = (category = 0, queryStr) => {
  return db.query(`SELECT slug FROM categories`).then((data) => {
    const validCategoriesArr = data.rows.map((categ) => {
      return categ.slug;
    });
    if (category !== 0) {
      //not undefined
      if (validCategoriesArr.includes(category)) {
        queryStr += ` WHERE category = $1`;
      } else {
        return Promise.reject({ status: 400, msg: "Very Bad Request!" });
      }
    }
    return queryStr;
  });
};

sortReviewsByColumn = (column = "created_at", queryStr) => {
  const validColumns = [
    "review_id",
    "title",
    "category",
    "designer",
    "owner",
    "review_body",
    "review_img_url",
    "created_at",
    "votes",
  ];
  if (validColumns.includes(column)) {
    queryStr += ` ORDER BY ${column}`;
    return queryStr;
  }
};

sortReviewsOrder = async (order = "DESC", queryStr, queryValues = 0) => {
  const validOrders = ["ASC", "DESC"];
  if (validOrders.includes(order.toUpperCase())) {
    queryStr += ` ${order.toUpperCase()}`;
    if (queryValues === 0) {
      return db.query(queryStr).then((data) => {
        return data.rows;
      });
    } else {
      return db.query(queryStr, [`${queryValues}`]).then((data) => {
          return data.rows;
      });
    }
  } else {
    return Promise.reject({ status: 400, msg: "Very Bad Request!" });
  }
};

exports.handleQueries = (req) => {
  let queries = [req.query.category, req.query.sort_by, req.query.order];
  queries = queries.map((query) => {
    if (query === "") {
      return undefined;
    } else {
      return query;
    }
  });
  if (Object.keys(req.query).length === 0) {
    //if there is no query
    return selectReviews().then((reviews) => {
      return reviews;
    });
  } else {
    const queryValues = queries[0]; //$1
    let queryStr = `SELECT * FROM reviews`;
    return (queryStr = selectReviewsByCategory(queries[0], queryStr).then(
      (queryStr) => {
        queryStr = sortReviewsByColumn(queries[1], queryStr);
        return sortReviewsOrder(queries[2], queryStr, queryValues).then(
          (reviews) => {
            return reviews;
          }
        );
      }
    ));
  }
};
