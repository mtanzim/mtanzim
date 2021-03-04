const fs = require("fs");

const plotlyApiKey = process.env.PLOTLY_KEY;
const plotlyApiUser = process.env.PLOTLY_USER;
const plotly = require("plotly")(plotlyApiUser, plotlyApiKey);

function makePlot(data, fileName) {
  const plotData = {
    y: data.map((d) => d.name),
    x: data.map((d) => d.percent.toFixed(1)),
    type: "bar",
    text: data.map((d) => d.percent.toFixed(1)),
    textposition: "auto",
    orientation: "h",
    marker: {
      color: data.map((d) => d.color),
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
      yaxis: {
        showgrid: false,
      },
      xaxis: {
        showgrid: false,
        visible: false,
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
  const sortedData = data.sort((a, b) => a.percent - b.percent);
  const topData = sortedData.slice(MAX_COUNT).filter((d) => d.name !== "Other");
  const remainingPct = 100 - topData.reduce((acc, cur) => acc + cur.percent, 0);
  const preparedData = [
    {
      name: "Other",
      percent: remainingPct,
      color: "#9467bd",
    },
  ].concat(topData);
  return preparedData;
}

module.exports = {
  prepareData,
  makePlot,
};
