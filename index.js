require("dotenv").config();

const { fetchLanguageData, parseData, fetchGuacData } = require("./getData");
const { makePlot } = require("./plotData");
const { removeOldImages, updateReadme } = require("./manageFiles");

function daysBetween(start, end) {
  if (start && end) {
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(
      Math.abs((new Date(start) - new Date(end)) / oneDay)
    );
    return diffDays;
  }
  return;
}

async function main() {
  const fetchFn = process.env["IS_GUAC"]
    ? () => {
        const months = process.env["GUAC_MONTHS"];
        const today = new Date().toISOString().split("T")[0];
        let before = new Date();
        before.setMonth(before.getMonth() - months);
        before = before.toISOString().split("T")[0];
        return fetchGuacData(before, today);
      }
    : fetchLanguageData;

  const { languageStats, startDate, endDate } = await fetchFn();
  if (!languageStats) {
    throw new Error("Failed to fetch API data!");
  }
  const parsed = parseData(languageStats);
  console.log("API Data Parsed");
  console.log(parsed);
  const ts = Date.now();
  const fileName = `waka${ts}.png`;
  console.log(`Creating plot in ${fileName}`);
  const days = daysBetween(startDate, endDate);
  console.log("Plot dates: ");
  console.log({ startDate, endDate, days });
  makePlot(parsed, fileName);
  console.log(`Removing old images`);
  removeOldImages(fileName);
  console.log(`Updating readme`);
  updateReadme(fileName);
}

main();
