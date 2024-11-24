const fs = require("fs");
const { Blob } = require("buffer"); // Using Blob from the buffer module if needed

require("dotenv").config();

const { plotGuac } = require("./getData");
const { removeOldImages, updateReadme } = require("./manageFiles");
const process = require("process");

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

  const ts = Date.now();
  const fileName = `waka${ts}.png`;
  console.log(`Creating plot in ${fileName}`);

  const buffer = await plotGuac(before, today);

  try {
    fs.writeFileSync(fileName, buffer);
    console.log("File written successfully:", fileName);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Removing old images`);
  removeOldImages(fileName);
  console.log(`Updating readme`);
  updateReadme(fileName);
}

main();
