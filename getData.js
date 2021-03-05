const colors = require("./colors");
const fetch = require("node-fetch");

function parseData(languages) {
  return languages.map((l) => ({
    name: l.name,
    percent: l.percent,
    color: colors?.[l.name]?.color,
  }));
}

async function fetchData() {
  const wakaUrl = process.env.WAKATIME_URL;
  const wakaApiKey = process.env.WAKA_API_KEY;
  const encoded = Buffer.from(wakaApiKey).toString("base64");
  const authHeader = { Authorization: `Basic ${encoded}` };
  const res = await fetch(wakaUrl, { headers: authHeader });
  const {
    data: { languages },
  } = await res.json();
  return languages;
}

module.exports = {
  parseData,
  fetchData,
};