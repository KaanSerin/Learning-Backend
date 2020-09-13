/**
 * @desc    Helpful app wide error response utility class
 */

module.exports = class ErrorResponse {
  constructor(message, statusCode) {
    this.message = message;
    this.statusCode = statusCode;
  }
};
