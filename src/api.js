import { getFactoriesState } from "../utils/smartweave.js";
import {
  polling,
  getPodcasts,
  getEpisodes,
} from "../utils/cache.js";
import express from "express";
import base64url from "base64url";

const app = express();
const port = process.env.PORT || 3000;

app.get("/feeds/podcasts", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const encodedFeed = await getPodcasts();
  const jsonRes = JSON.parse(base64url.decode(encodedFeed));
  res.send(jsonRes);
});

app.get("/feeds/episodes/:pid", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const encodedFeed = await getEpisodes(req.params.pid);
  const jsonRes = JSON.parse(base64url.decode(encodedFeed));
  res.send(jsonRes);
});

app.listen(port, async () => {
  await polling();
  console.log(`listening at http://localhost:${port}`);
});
