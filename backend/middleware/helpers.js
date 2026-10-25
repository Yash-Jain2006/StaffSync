class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const pick = (obj, keys) => {
  if (!obj) return {};
  return keys.reduce((acc, k) => {
    if (obj[k] !== undefined) acc[k] = obj[k];
    return acc;
  }, {});
};

const isValidDate = (val) => {
  if (!val) return false;
  const d = new Date(val);
  return !isNaN(d.getTime());
};

const todayKey = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const notify = async (userId, payload) => {
  // In-memory or logging stub for notifications
  return true;
};

module.exports = {
  HttpError,
  asyncHandler,
  pick,
  isValidDate,
  todayKey,
  notify,
};
