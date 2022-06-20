exports.createResponse = (res, jsonObject, statusCode) => {
  return res.status(statusCode).json({ ...jsonObject, statusCode: statusCode });
};
