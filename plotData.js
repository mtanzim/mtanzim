const fs = require("fs");

const plotlyApiKey = process.env.PLOTLY_KEY;
const plotlyApiUser = process.env.PLOTLY_USER;
const plotly = require("plotly")(plotlyApiUser, plotlyApiKey);

function makePlot(data, fileName) {
  const plotData = {
    labels: data.map((d) => d.name),
    values: data.map((d) => d.percent.toFixed(1)),
    type: "pie",
    hole: 0.8,
    textinfo: "label",
    // insidetextorientation: "radial",
    textposition: "outside",
    automargin: true,
    marker: {
      colors: data.map((d) => d.color),
    },
  };
  console.log("Plot Data");
  console.log(plotData);
  const figure = {
    data: [plotData],
    layout: {
      showlegend: false,
      title: {
        text: `Languages used over the last 7 days`,
      },
      font: {
        // family: "Courier New, monospace",
        size: 12,
        color: "#7f7f7f",
      },
      plot_bgcolor: "rgba(0,0,0,0)",
      paper_bgcolor: "rgba(0,0,0,0)",
    },
  };
  const imgOpts = {
    format: "png",
    width: 375,
    height: 375,
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
