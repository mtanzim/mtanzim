const fetch = require("node-fetch");
const { plot } = require("nodeplotlib");
const url =
  "https://wakatime.com/share/@2df932ff-33cc-42a9-a0a7-023ed4c13bfa/97adae7e-cc36-46e8-94d5-caf195f07dc8.json";

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
  plot([plotData]);
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
