import { getFactoriesState } from "./utils/smartweave.js";
import {
  polling,
  getPodcasts,
  getEpisodes,
  singleEpisode,
} from "./utils/cache.js";
import { generateRss } from "./utils/rss.js";
import express from "express";
import base64url from "base64url";
import cors  from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: "*"
}));

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

app.get("/feeds/rss/:pid", async (req, res) => {
  res.setHeader("Content-Type", "application/xml");
  const rss = await generateRss(req.params.pid);
  res.send(rss);
});

app.get("/feeds/view/:pid/:eid", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const pid = req.params.pid;
  const eid = req.params.eid;
  const encodedFeed = await singleEpisode(pid, eid);
  const jsonRes = JSON.parse(base64url.decode(encodedFeed));
  res.send(jsonRes);
});
app.listen(port, async () => {
  await polling();
  console.log(`listening at http://localhost:${port}`);
});
