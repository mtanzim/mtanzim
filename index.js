const fs = require("fs");
const { Blob } = require("buffer"); // Using Blob from the buffer module if needed

require("dotenv").config();

const {
  fetchLanguageData,
  parseData,
  fetchGuacData,
  plotGuac,
} = require("./getData");
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
  const months = process.env["GUAC_MONTHS"];
  const today = new Date().toISOString().split("T")[0];
  let before = new Date();
  before.setMonth(before.getMonth() - months);
  before = before.toISOString().split("T")[0];
  // return fetchGuacData(before, today);
  const buffer = await plotGuac(before, today);

  // Convert the blob (or similar object) to a Node.js Buffer.
  // const buffer = Buffer.from(blob);

  // Alternatively, if plotGuac returns or works as a Uint8Array we can create it directly
  // const buffer = Buffer.from(new Uint8Array(blob));

  // Specify the file path where you want to save the blob data
  const filePath = "output.png"; // or any other appropriate file name

  // Write the buffer to the file
  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log("File written successfully:", filePath);
    }
  });
}
// const fetchFn = process.env["IS_GUAC"]
//   ? () => {
//       const months = process.env["GUAC_MONTHS"];
//       const today = new Date().toISOString().split("T")[0];
//       let before = new Date();
//       before.setMonth(before.getMonth() - months);
//       before = before.toISOString().split("T")[0];
//       // return fetchGuacData(before, today);
//       return plotGuac(before, today);
//     }
//   : fetchLanguageData;

//   const { languageStats, startDate, endDate } = await fetchFn();
//   if (!languageStats) {
//     throw new Error("Failed to fetch API data!");
//   }
//   const parsed = parseData(languageStats);
//   console.log("API Data Parsed");
//   console.log(parsed);
//   const ts = Date.now();
//   const fileName = `waka${ts}.png`;
//   console.log(`Creating plot in ${fileName}`);
//   const days = daysBetween(startDate, endDate);
//   console.log("Plot dates: ");
//   console.log({ startDate, endDate, days });
//   makePlot(parsed, fileName);
//   console.log(`Removing old images`);
//   removeOldImages(fileName);
//   console.log(`Updating readme`);
//   updateReadme(fileName);
// }

main();
