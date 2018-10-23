'use strict';

module.exports.oauthorization = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Your function executed successfully!',
      input: event,
    }),
  };
};
