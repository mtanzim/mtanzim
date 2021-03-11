require("dotenv").config();

const { fetchLanguageData, parseData } = require("./getData");
const { makePlot, prepareData } = require("./plotData");
const { removeOldImages, updateReadme } = require("./manageFiles");

async function main() {
  const data = await fetchLanguageData();
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
