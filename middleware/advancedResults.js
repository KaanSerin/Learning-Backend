const advancedResults = (model, populate) => async (req, res, next) => {
  let queryParams = { ...req.query };

  // Remove problematic query params
  const removedParams = ["select", "limit", "page", "sort"];
  removedParams.forEach((param) => delete queryParams[param]);

  //#region Mongoose query filtering
  let select = req.query.select;

  let limit = parseInt(req.query.limit);

  if (select) {
    select = select.split(",").join(" ");
  }

  if (limit && isNaN(limit)) {
    console.log("Limit must be a number");
    limit = 10;
  }
  //#endregion

  //#region Pagination
  let pagination = {};
  let page = parseInt(req.query.page);
  if (limit && isNaN(limit)) {
    console.log("Page must be a number");
    page = 1;
  }

  const skip = (page - 1) * limit;

  if (page > 1) {
    pagination.prev = { page: page - 1, limit };
  }
  const noOfDocuments = await model.countDocuments();

  if (page * limit < noOfDocuments) {
    pagination.next = { page: page + 1, limit };
  }
  //#endregion

  //#region Sorting
  let sort = req.query.sort;
  if (sort) {
    sort = sort.split(",").join(" ");
  }
  //#endregion

  const authors = await model
    .find(queryParams, select)
    .populate(populate)
    .limit(limit)
    .skip(skip)
    .sort(sort);

  if (authors.length === 0) {
    return next(new ErrorResponse("No authors found.", 400));
  }

  res.advancedResults = {
    success: true,
    count: authors.length,
    data: authors,
    pagination,
  };

  next();
};

module.exports = advancedResults;
