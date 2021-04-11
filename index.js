require("dotenv").config();

const { fetchLanguageData, parseData, fetchGuacData } = require("./getData");
const { makePlot } = require("./plotData");
const { removeOldImages, updateReadme } = require("./manageFiles");

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

  const data = await fetchFn();
  if (!data) {
    throw new Error("Failed to fetch API data!");
  }
  const parsed = parseData(data);
  console.log("API Data Parsed");
  console.log(parsed);
  const ts = Date.now();
  const fileName = `waka${ts}.png`;
  console.log(`Creating plot in ${fileName}`);
  makePlot(parsed, fileName);
  console.log(`Removing old images`);
  removeOldImages(fileName);
  console.log(`Updating readme`);
  updateReadme(fileName);
}

main();
