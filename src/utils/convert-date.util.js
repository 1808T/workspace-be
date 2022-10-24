const toTimeStamp = (str) => {
  const date = new Date(str);
  return date.getTime();
};

const toDate = (timestamp) => {
  const ts = new Date(timestamp);
  return ts.toDateString();
};

Date.prototype.getWeek = function () {
  var onejan = new Date(this.getFullYear(), 0, 1);
  var today = new Date(this.getFullYear(), this.getMonth(), this.getDate());
  var dayOfYear = (today - onejan + 86400000) / 86400000;
  return Math.ceil(dayOfYear / 7);
};

export { toDate, toTimeStamp };
