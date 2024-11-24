const fs = require("fs");

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
      console.log(`updated readme with ${replacement}`);
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

module.exports = {
  updateReadme,
  removeOldImages,
};
