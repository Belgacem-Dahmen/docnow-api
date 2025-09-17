export const apiResponse = (success, message, data = null, errors = null) => ({
  success,
  message,
  data,
  errors,
});