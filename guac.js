const AWS = require("aws-sdk");

const invokeLambda = (lambda, params) =>
  new Promise((resolve, reject) => {
    lambda.invoke(params, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });

const getGuacData = async (start, end) => {
  AWS.config.update({
    accessKeyId: process.env["AWS_ACCESS_KEY_ID"],
    secretAccessKey: process.env["AWS_SECRET_ACCESS_KEY"],
    region: process.env["AWS_REGION"],
  });

  const lambda = new AWS.Lambda();

  const params = {
    FunctionName: process.env["LAMBDA_NAME"],
    Payload: JSON.stringify({
      start,
      end,
    }),
  };

  try {
    const result = await invokeLambda(lambda, params);
    if (result?.StatusCode === 200) {
      return JSON.parse(JSON.parse(result.Payload));
    }
    throw new Error("Failed to invoke lambda");
  } catch (err) {
    console.log(err);
    throw err;
  }
};
module.exports = { getGuacData };
