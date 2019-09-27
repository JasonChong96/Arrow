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
      obj[key] = new Date(obj[key]);
    } else if (typeof obj[key] === 'object') {
      convertDates(obj[key]);
    }
  });
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
      convertDatesToString(obj[key]);
    }
  });
  return obj;
}

const daysShort = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export function getShortDayString(day) {
  return daysShort[day];
}

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function getDayString(date) {
  return days[date.getDay()];
}

const months = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUNE',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];

export function getMonthString(month) {
  return months[month];
}

export function daysTill(date) {
  const date2 = date.getTime ? date : new Date(date);
  const date1 = new Date();
  const timeDiff = date2.getTime() - date1.getTime();
  const daysDiff = timeDiff / (1000 * 3600 * 24);
  return Math.floor(daysDiff);
}

export function daysBetween(date1, date2) {
  const date22 = new Date(date2);
  const date11 = new Date(date1);
  const timeDiff = date22.getTime() - date11.getTime();
  const daysDiff = timeDiff / (1000 * 3600 * 24);
  return Math.floor(daysDiff);
}
