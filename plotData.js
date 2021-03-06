const fs = require("fs");
const { synonyms } = require("./synonyms");

const plotlyApiKey = process.env.PLOTLY_KEY;
const plotlyApiUser = process.env.PLOTLY_USER;
const plotly = require("plotly")(plotlyApiUser, plotlyApiKey);

const MAX_LANG_COUNT = 5;

function makePlot(data, fileName) {
  const plotData = {
    labels: data.map((d) => d.name),
    values: data.map((d) => d.percent.toFixed(1)),
    type: "pie",
    hole: 0.7,
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
        family: "Courier New, monospace",
        size: 12,
        color: "#7f7f7f",
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

function synonimizeData(data) {
  // ie: JSX has a synonym: JavaScript, so it would show up in synonmymData:
  // {"JSX":12.3}
  const synonymData = data.filter((d) => synonyms.has(d.name));
  // ie: Javascript gets a boost from JSX:
  // {"JavaScript":12.3}
  const synonymBoosts = new Map();
  synonymData.forEach((d) =>
    synonymBoosts.set(synonyms.get(d.name), d.percent)
  );
  return data
    .map((d) => {
      if (synonymBoosts.has(d.name)) {
        return {
          ...d,
          percent: d.percent + synonymBoosts.get(d.name),
        };
      }
      if (synonyms.has(d.name)) {
        return {
          ...d,
          percent: 0,
        };
      }
      return d;
    })
    .filter((d) => d.percent !== 0);
}

function prepareData(data) {
  const mergedData = synonimizeData(data);
  const sortedData = mergedData.sort((a, b) => b.percent - a.percent);
  const topData = sortedData
    .slice(0, MAX_LANG_COUNT)
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
