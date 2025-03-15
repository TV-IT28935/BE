const successResponse = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    status: statusCode,
    message,
    data,
  });
};

const notFoundResponse = (res, message, data = null, statusCode = 204) => {
  return res.status(statusCode).json({
    status: statusCode,
    message,
    data,
  });
};

const errorResponse400 = (res, message, errors = [], statusCode = 400) => {
  return res.status(statusCode).json({
    status: statusCode,
    message,
    errors,
  });
};

const errorResponse500 = (res, message, errors = [], statusCode = 500) => {
  return res.status(statusCode).json({
    status: statusCode,
    message,
    errors,
  });
};

const authorizationResponse = (res, message, data = null, statusCode = 403) => {
  return res.status(statusCode).json({
    status: statusCode,
    message,
    data,
  });
};

const authenticationResponse = (
  res,
  message,
  data = null,
  statusCode = 401
) => {
  return res.status(statusCode).json({
    status: statusCode,
    message,
    data,
  });
};

export {
  notFoundResponse,
  successResponse,
  errorResponse400,
  errorResponse500,
  authorizationResponse,
  authenticationResponse,
};
