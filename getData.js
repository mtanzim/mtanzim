const colors = require("./colors");
const fetch = require("node-fetch");
const { getGuacData } = require("./guac");

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
const DELAY_BW_TRIES = 5000;
async function fetchLanguageData(curTry = 0) {
  console.log(`Attempt ${curTry} at data fetching`);
  const { data } = await fetchData();
  const { languages, is_up_to_date } = data;
  if (!is_up_to_date) {
    if (curTry > MAX_TRIES - 2) {
      throw new Error("Cannot get fresh stats");
    }
    console.log(
      `Attempt ${curTry} at data fetching failed to fresh stats. Retrying...`
    );
    await new Promise((resolve, _) => setTimeout(resolve, DELAY_BW_TRIES));
    return fetchLanguageData(curTry + 1);
  }

  return { languageStats: languages };
}

const transformGuacToWaka = (res) => {
  const {
    startDate,
    endDate,
    languageStats: { percentages },
  } = res;
  const transformed = percentages.map((l) => ({
    name: l.language,
    percent: l.percentage,
  }));

  console.log("Retrieved data from Guac, following are the days available");
  console.log({ startDate, endDate });

  return { languageStats: transformed, startDate, endDate };
};

async function fetchGuacData(start, end) {
  console.log("Requesting data from Guac, following are the days requested");
  console.log({ startDate: start, endDate: end });
  const res = await getGuacData(start, end);
  return transformGuacToWaka(res);
}

module.exports = {
  parseData,
  fetchLanguageData,
  fetchGuacData,
  fetchData,
};
