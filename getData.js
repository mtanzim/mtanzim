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
  return res.json();
}

const MAX_TRIES = 3;
const DELAY_BW_TRIES = 1500;
async function fetchLanguageData(cur_try = 0) {
  console.log(`Attempt ${cur_try} at data fetching`);
  const {
    data: { languages, is_up_to_date },
  } = await fetchData();
  if (!is_up_to_date) {
    if (cur_try > MAX_TRIES - 2) {
      throw new Error("Cannot get fresh stats");
    }
    console.log(
      `Attempt ${cur_try} at data fetching failed to fresh stats. Retrying...`
    );
    await new Promise((resolve, _) => setTimeout(resolve, DELAY_BW_TRIES));
    return fetchLanguageData(cur_try + 1);
  }

  return languages;
}

module.exports = {
  parseData,
  fetchLanguageData,
  fetchData,
};
