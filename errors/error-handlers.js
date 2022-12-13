exports.handleBadRequestErrors = (err, req, res, next) => {
    if (err.code === "22P02") {
      res.status(400).send({ msg: "Very Bad Request!" });
    } else {
      next(err);
    }
  };
  
  exports.handleCustomErrors = (err, req, res, next) => {
      if (err.msg !== undefined) {
      res.status(err.status).send({ msg: err.msg });
    } else {
      next(err)
    }
  };
  
  exports.finalHandleErrors = (err, req, res, next) => {
    res.status(500).send({ msg: "Internal server error!" });
  };