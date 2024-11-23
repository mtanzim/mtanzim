require("dotenv").config();

const fetch = require("node-fetch");
const URL = process.env["GUAC_URL"];

const login = async () => {
  const username = process.env["GUAC_USERNAME"];
  const password = process.env["GUAC_USERPASS"];

  const res = await fetch(`${URL}/login`, {
    method: "POST",
    body: JSON.stringify({
      username,
      password,
    }),
  });
  if (res?.status !== 200) {
    console.error(await res?.text())
    throw new Error("Failed to authenticate guac user");
  }
  const { token } = await res.json();
  return { Authorization: `Bearer ${token}` };
};

const main = async (start, end) => {
  const authHeader = await login();
  const res = await fetch(`${URL}/data?start=${start}&end=${end}`, {
    headers: authHeader,
  });
  if (res?.status !== 200) {
    throw new Error("Failed to get data from guac api");
  }
  return res.json();
};

module.exports = { getGuacData: main };
