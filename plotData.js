const fs = require("fs");

const plotlyApiKey = process.env.PLOTLY_KEY;
const plotlyApiUser = process.env.PLOTLY_USER;
const plotly = require("plotly")(plotlyApiUser, plotlyApiKey);

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
        text: `Languages used over last 7 days, from ${today}`,
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

module.exports = {
  prepareData,
  makePlot,
};
