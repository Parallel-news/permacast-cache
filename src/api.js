import { getFactoriesState } from "./utils/smartweave.js";
import { getEpisodeMetadata } from "./embed/embeding.js";
import {
  stats,
  polling,
  getPodcasts,
  getEpisodes,
  singleEpisode,
  getProfileFeed,
  getEpisodesFeed,
  getTotalPermacastSize,
} from "./utils/cache.js";
import { generateRss } from "./utils/rss.js";
import { sort } from "./utils/sort.js";
import express from "express";
import base64url from "base64url";
import cors  from "cors";

const app = express();
const port = process.env.PORT || 3000;


app.use(express.static('public'))

app.use(cors({
    origin: "*"
}));
app.set("view engine", "ejs");

app.get("/feeds/podcasts", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const encodedFeed = await getPodcasts();
  const jsonRes = JSON.parse(base64url.decode(encodedFeed));
  res.send(jsonRes);
});

app.get("/feeds/allcontent", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const encodedFeed = await getEpisodesFeed();
  const jsonRes = JSON.parse(base64url.decode(encodedFeed));
  res.send(jsonRes);
});

app.get("/feeds/stats", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const encodedFeed = await stats();
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

app.get("/size/permacast", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const encodedRes = await getTotalPermacastSize();
  const jsonRes = JSON.parse(base64url.decode(encodedRes));
  res.send(jsonRes);
});

app.get("/feeds/user/:address", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const encodedRes = await getProfileFeed(req.params.address);
  const jsonRes = JSON.parse(base64url.decode(encodedRes));
  res.send(jsonRes);
});

app.get("/embed/:eid", async(req, res) => {
  const metadata = await getEpisodeMetadata(req.params.eid);
  res.render("index", {metadata: metadata});
});

app.get("/feeds/podcasts/sort/:type", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const encodedRes = await sort(req.params.type);
  const jsonRes = JSON.parse(base64url.decode(encodedRes));
  res.send(jsonRes);
});

app.listen(port, async () => {
  await polling();
  console.log(`listening at PORT:${port}`);
});
