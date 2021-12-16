import NodeCache from "node-cache";
import base64url from "base64url";
import { getFactoriesState } from "./smartweave.js";
import { BLACKLIST } from "./constants/blacklist.js";
const base64Cache = new NodeCache();

async function cache() {
  const base64urlState = await getFactoriesState();

  if (!base64Cache.has("state")) {
    base64Cache.set("state", base64urlState);
  }

  if (base64urlState !== base64Cache.get("state")) {
    console.log(`NEW STATE CACHED: ${base64urlState}`)
    base64Cache.set("state", base64urlState);
  } else {
    console.log(`\n\n\n\n\n STATE ALREADY CACHED: ${base64Cache.get("state")}`);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function removeBlacklists(podObj) {
  const episodes = podObj["episodes"];
  const blacklists = episodes.filter((episode) =>
    BLACKLIST.episodes.includes(episode.eid)
  );

  if (blacklists.length === 0) {
    return podObj;
  }

  for (let episode of blacklists) {
    const epIndex = episodes.findIndex((ep) => ep.eid === episode.eid);
    episodes.splice(epIndex, 1);
  }

  podObj["episodes"] = episodes;

  return podObj;
}

async function getPermacast() {
  if (!base64Cache.has("state")) {
    return base64url("{}");
  }

  return base64Cache.get("state");
}

export async function getPodcasts() {
  const encodedPermacast = await getPermacast();
  // "{}" in base64url
  const EMPTY_OBJECT = "e30";
  const res = [];

  if (encodedPermacast === EMPTY_OBJECT) {
    return EMPTY_OBJECT;
  }

  const decodedPermacast = JSON.parse(base64url.decode(encodedPermacast));

  for (let factory of decodedPermacast.res) {
    const podcasts = factory.podcasts;

    if (podcasts.length === 0) {
      continue;
    }

    if (podcasts.length > 1) {
      for (let podcast of podcasts) {
        delete podcast["logs"];
          res.push(podcast);

      }
    } else {
      delete podcasts[0]["logs"];
      res.push(podcasts[0]);
    }
  }

  const response = {
    res: res,
  };
  return base64url(JSON.stringify(response));
}

export async function getEpisodes(pid) {
  const encodedPodcasts = await getPodcasts();
  // "{}" in base64url
  const EMPTY_OBJECT = "e30";
  const res = [];

  if (encodedPodcasts === EMPTY_OBJECT) {
    return EMPTY_OBJECT;
  }

  const podcasts = JSON.parse(base64url.decode(encodedPodcasts)).res;
  const podcastIndex = podcasts.findIndex((podcast) => podcast.pid === pid);

  if (podcastIndex === -1) {
    return EMPTY_OBJECT;
  }

  const podcastObject = removeBlacklists(podcasts[podcastIndex])
  return base64url(JSON.stringify(podcastObject));
}

export async function singleEpisode(pid, eid) {
  const EMPTY_ARRAY = "W10";
  const EMPTY_OBJECT = "e30";
  const podcastObject = JSON.parse(base64url.decode(await getEpisodes(pid)));
  const episodes = podcastObject["episodes"];

  const terminators = [EMPTY_ARRAY, undefined];
  if (terminators.includes(episodes)) {
    return EMPTY_OBJECT;
  }

  if (eid.length !== 43) {
    const index = Number(eid);
    const episode = episodes[index] ? episodes[index] : EMPTY_OBJECT;
    return base64url(JSON.stringify(episode));
  }

  const episodeIndex = episodes.findIndex((episode) => episode.eid === eid);

  if (episodeIndex === -1) {
    return EMPTY_OBJECT;
  }

  return base64url(JSON.stringify(episodes[episodeIndex]));
}

export async function polling(blocksNb) {
  while (true) {
    if (!blocksNb) {
      var blocksNb = 1;
    }

    await cache();
    // in sec
    const EST_BLOCK_TIME = 2 * 60 * 1000 * blocksNb;
    await sleep(EST_BLOCK_TIME);
  }
}
