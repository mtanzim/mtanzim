require("dotenv").config();
const fs = require("fs");

const fetch = require("node-fetch");
const apiKey = process.env.PLOTLY_KEY;
const apiUser = process.env.PLOTLY_USER;
const url = process.env.WAKATIME_URL;

const plotly = require("plotly")(apiUser, apiKey);

function makePlot(data, fileName) {
  const plotData = {
    labels: data.map((d) => d.name),
    values: data.map((d) => d.percent.toFixed(1)),
    type: "pie",
    textinfo: "label+percent",
    insidetextorientation: "radial",
    marker: {
      colors: data.map((d) => d.color),
    },
  };
  console.log("Plot Data");
  console.log(plotData);
  const today = new Date().toISOString().slice(0, 10);
  const figure = {
    data: [plotData],
    layout: {
      title: {
        text: `Languages over last 7 days, since ${today}`,
      },
      plot_bgcolor: "rgba(0,0,0,0)",
      paper_bgcolor: "rgba(0,0,0,0)",
    },
  };
  const imgOpts = {
    format: "png",
    width: 500,
    height: 500,
  };
  plotly.getImage(figure, imgOpts, function (err, imageStream) {
    if (err) return console.log(err);

    const fileStream = fs.createWriteStream(fileName);
    imageStream.pipe(fileStream);
  });
}

function prepareData(data) {
  const MAX_COUNT = 5;
  const sortedData = data.sort((a, b) => b.percent - a.percent);
  const topData = sortedData
    .slice(0, MAX_COUNT)
    .filter((d) => d.name !== "Other");
  const remainingPct = 100 - topData.reduce((acc, cur) => acc + cur.percent, 0);
  const preparedData = topData.concat({
    name: "Other",
    percent: remainingPct,
    color: "#9467bd",
  });
  return preparedData;
}

function updateReadme(plotFileName) {
  const mdFile = "README.md";

  fs.readFile(mdFile, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }

    const regex = /<!-- START_WAKA -->((.|\n)*)<!-- END_WAKA -->/g;
    const replacement = `<!-- START_WAKA -->
    ![Language Statistics](${plotFileName} "Languages")
    <!-- END_WAKA -->`;
    const result = data.replace(regex, replacement);

    fs.writeFile(mdFile, result, "utf8", function (err) {
      if (err) return console.log(err);
    });
  });
}

function removeOldImages(plotFileName) {
  fs.readdirSync(".")
    .filter((f) => f.includes(".png"))
    .forEach((file) => {
      if (file !== plotFileName) {
        console.log(`Removing ${file}`);
        fs.unlinkSync(`./${file}`);
      }
    });
}

async function main() {
  const res = await fetch(url);
  const { data } = await res.json();
  console.log("API Data");
  console.log(data);
  const ts = Date.now();
  const fileName = `waka${ts}.png`;
  console.log(`Creating plot in ${fileName}`);
  makePlot(prepareData(data), fileName);
  console.log(`Removing old images`);
  removeOldImages(fileName);
  console.log(`Updating readme`);
  updateReadme(fileName);
}

main();
