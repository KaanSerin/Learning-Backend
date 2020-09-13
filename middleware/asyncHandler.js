/**
 * @purpose     Saves us the hassle of typing try{}catch{} inside each controller
 * @description This type of method is called a Curried Function
 * @explanation https://stackoverflow.com/questions/32782922/what-do-multiple-arrow-functions-mean-in-javascript
 */

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
