require("dotenv").config();

const fetch = require("node-fetch");
const URL = process.env["GUAC_URL"];

const login = async () => {
  const username = process.env["GUAC_USERNAME"];
  const password = process.env["GUAC_USERPASS"];

  console.log({ username, password, url: URL });
  const res = await fetch(`${URL}/login`, {
    method: "POST",
    body: JSON.stringify({
      username,
      password,
    }),
  });
  const { token } = await res.json();
  console.log(token);
  return { Authorization: `Bearer ${token}` };
};

const main = async (start, end) => {
  const authHeader = await login();
  console.log(authHeader);
  const res = await fetch(`${URL}/data`, { headers: authHeader });
  return res.json();
};

module.exports = { getGuacData: main };
