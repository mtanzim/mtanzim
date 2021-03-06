require("dotenv").config();

const { fetchData } = require("./getData");

const { MongoClient, Timestamp } = require("mongodb");
const uri = process.env.DB_ADDRESS;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function persist(data) {
  await client.connect();
  const collection = client
    .db(process.env.DB_NAME)
    .collection(process.env.DB_COLL);
  console.log("Connected");
  await collection.insertOne({ ...data, createtime: new Timestamp() });
  console.log("Persisted Data");
  return client.close();
}

async function main() {
  try {
    const data = await fetchData();
    if (!data) {
      throw new Error("No data from API");
    }
    return persist(data);
  } catch (err) {
    console.log(err);
  }
}

main();
