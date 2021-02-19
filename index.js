require("dotenv").config();
const fs = require("fs");

const fetch = require("node-fetch");
const url = process.env.WAKATIME_URL;
const apiKey = process.env.PLOTLY_KEY;
const apiUser = process.env.PLOTLY_USER;
const plotly = require("plotly")(apiUser, apiKey);

function plotData(data) {
  const plotData = {
    labels: data.map((d) => d.name),
    values: data.map((d) => d.percent),
    type: "pie",
    textinfo: "label+percent",
    insidetextorientation: "radial",
    marker: {
      colors: data.map((d) => d.color),
    },
  };
  console.log(plotData);
  const figure = {
    data: [plotData],
    layout: {
      plot_bgcolor: "black",
      paper_bgcolor: "#FFF3",
    },
  };
  var imgOpts = {
    format: "png",
    width: 500,
    height: 500,
  };
  plotly.getImage(figure, imgOpts, function (err, imageStream) {
    if (err) return console.log(err);
    const fileStream = fs.createWriteStream("waka.png");
    imageStream.pipe(fileStream);
  });
}

function prepareData(data) {
  const MAX_COUNT = 5;
  const sortedData = data.sort((a, b) => b.percent - a.percent);
  const topData = sortedData.slice(0, MAX_COUNT - 1);
  const remainingPct = sortedData
    .slice(MAX_COUNT)
    .reduce((acc, cur) => acc + cur.percent, 0);
  const preparedData = topData.concat({
    name: "Others",
    percent: remainingPct,
    color: "#9467bd",
  });
  return preparedData;
}

async function fetchData() {
  const res = await fetch(url);
  const { data } = await res.json();
  console.log(data);
  plotData(prepareData(data));
}

fetchData();
