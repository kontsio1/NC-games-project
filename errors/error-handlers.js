exports.handleBadRequestErrors = (err, req, res, next) => {
    if (err.code === "22P02" || err.code === '23502' || err.code === '42601') {
      res.status(400).send({ msg: "Very Bad Request!" });
    } else {
      next(err);
    }
  };
  
  exports.handleNotFoundErrors = (err, req, res, next) => {
    if (err.code === '23503') {
      res.status(404).send({ msg: "Not found!" });
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

  exports.handleWrongPath = (req, res) => {
    res.status(404).send({msg: 'Sorry what?'})
  }