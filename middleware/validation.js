const jsonschema = require("jsonschema");
const bookSchema = require("../schemas/bookSchema.json");
const ExpressError = require("../expressError");

function validate(req, res, next) {
  let bookData;

  if (req.method === "POST" || req.method === "PUT") {
    bookData = req.body;
  } else if (req.method === "DELETE") {
    bookData = req.params;
  }

  if (bookData) {
    const result = jsonschema.validate(bookData, bookSchema);
    if (!result.valid) {
      let errors = result.errors.map((e) => e.stack);
      return next(new ExpressError(errors, 400));
    }
  }

  return next();
}

module.exports = validate;
