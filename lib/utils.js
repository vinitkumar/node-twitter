/**
 * Formats mongoose errors into proper array
 *
 * @param {Array} errors
 * @return {Array}
 * @api public
 */

exports.errors = errors => {
  let keys = Object.keys(errors);
  const errs = [];

  // if there is no validation error, just display a generic error
  if (!keys) {
    return ['Oops! There was an error'];
  }

  keys.forEach(key => {
    errs.push(errors[key].message);
  });

  return errs;
};

/**
 * Index of object within an array
 *
 * @param {Array} arr
 * @param {Object} obj
 * @return {Number}
 * @api public
 */

/**
 * Find object in an array of objects that matches a condition
 *
 * @param {Array} arr
 * @param {Object} obj
 * @param {Function} cb - optional
 * @return {Object}
 * @api public
 */

exports.findByParam = (arr, obj, cb) => {
  let index = exports.indexof(arr, obj);
  if (~index && typeof cb === 'function') {
    return cb(undefined, arr[index]);
  } else if (~index && !cb) {
    return arr[index];
  } else if (!~index && typeof cb === 'function') {
    return cb('not found');
  }
  // else undefined is returned
};
