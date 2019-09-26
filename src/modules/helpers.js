// @flow
/**
 * Helper functions
 * @module Helpers
 */

/**
 * Convert data attributes to Object
 * @param {Element} elem
 * @returns {{}}
 */
export function datasetToObject(elem: Element): Object {
  const data = {};
  [].forEach.call(elem.attributes, attr => {
    /* istanbul ignore else */
    if (/^data-/.test(attr.name)) {
      const camelCaseName = attr.name.substr(5).replace(/-(.)/g, ($0, $1) => $1.toUpperCase());
      data[camelCaseName] = attr.value;
    }
  });
  return data;
}

export function convertDates(obj) {
  if (!obj) {
    return;
  }
  Object.keys(obj).forEach(key => {
    if (key == 'date' || key == 'deadline') {
      obj[key] = new Date(obj[key])
    } else if (typeof obj[key] === 'object') {
      convertDates(obj[key])
    }
  })
  return obj;
}

export function convertDatesToString(obj) {
  if (!obj) {
    return;
  }
  Object.keys(obj).forEach(key => {
    if (key == 'date' || key == 'deadline') {
      obj[key] = obj[key].toISOString().substring(0, 10);
    } else if (typeof obj[key] === 'object') {
      convertDatesToString(obj[key])
    }
  })
  return obj;
}

