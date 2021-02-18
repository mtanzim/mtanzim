const fetch = require('node-fetch');
const url =
  "https://wakatime.com/share/@2df932ff-33cc-42a9-a0a7-023ed4c13bfa/97adae7e-cc36-46e8-94d5-caf195f07dc8.json";

async function fetchData() {
  const res = await fetch(url);
  const json = await res.json();
  console.log(json);
}

fetchData();
