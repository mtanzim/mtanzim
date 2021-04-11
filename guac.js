const apigClientFactory = require("aws-api-gateway-client").default;

const apigClient = apigClientFactory.newClient({
  invokeUrl: process.env["AMZ_GW_EP"], // REQUIRED
  region: process.env["AWS_REGION"], // REQUIRED: The region where the API is deployed.
  accessKey: process.env["AWS_ACCESS_KEY_ID"], // REQUIRED
  secretKey: process.env["AWS_SECRET_ACCESS_KEY"], // REQUIRED
});

const getGuacData = (start, end) =>
  new Promise((resolve, reject) => {
    apigClient
      .invokeApi(
        null,
        process.env["AMZ_GW_PATH"],
        "GET",
        {
          queryParams: {
            start,
            end,
          },
        },
        null
      )
      .then(function (result) {
        return resolve(result);
      })
      .catch(function (err) {
        return reject(err);
      });
  });

module.exports = {  getGuacData };
