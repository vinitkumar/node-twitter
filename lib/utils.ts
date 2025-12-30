/**
 * Formats mongoose errors into proper array
 *
 * @param {Object} errors
 * @return {Array}
 * @api public
 */
export const errors = (errs: Record<string, any>): string[] => {
  const keys = Object.keys(errs);
  const formattedErrors: string[] = [];

  // if there is no validation error, just display a generic error
  if (!keys.length) {
    return ['Oops! There was an error'];
  }

  keys.forEach((key) => {
    formattedErrors.push(errs[key].message);
  });

  return formattedErrors;
};

/**
 * Find object in an array of objects that matches a condition
 *
 * @param {Array} arr
 * @param {Object} obj
 * @param {Function} cb - optional
 * @return {Object}
 * @api public
 */
export const findByParam = (
  arr: any[],
  obj: any,
  cb?: (err: any, result?: any) => void
): any => {
  const index = arr.findIndex((item) => item === obj);
  if (index !== -1 && typeof cb === 'function') {
    return cb(undefined, arr[index]);
  } else if (index !== -1 && !cb) {
    return arr[index];
  } else if (index === -1 && typeof cb === 'function') {
    return cb('not found');
  }
  // else undefined is returned
};
