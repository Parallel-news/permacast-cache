import NodeCache from "node-cache";
import base64url from "base64url";
import { sort } from "./sort.js";
import { getFactoriesState, getStateOf, getAnsState } from "./smartweave.js";
import { V2_V3_ARRAY } from "./constants/v2_v3_conversion.js";
import { BLACKLIST, MASKING_CONTRACT } from "./constants/blacklist.js";
const base64Cache = new NodeCache();

async function cache() {
  const base64urlState = await getFactoriesState();

  if (!base64Cache.has("state")) {
    base64Cache.set("state", base64urlState);
  }

  if (base64urlState !== base64Cache.get("state")) {
    console.log(`NEW STATE CACHED: ${base64urlState}`);
    base64Cache.set("state", base64urlState);
  } else {
    console.log(`\n\n\n\n\n STATE ALREADY CACHED: ${base64Cache.get("state")}`);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function removeBlacklists(podObj) {
  const episodes = podObj["episodes"];

  podObj["episodes"] = episodes.filter((episode) => episode.isVisible);

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

  const ansState = await getAnsState();
  const decodedPermacast = JSON.parse(base64url.decode(encodedPermacast));

  for (let factory of decodedPermacast.res) {
    const podcasts = factory.podcasts;

    if (podcasts.length === 0) {
      continue;
    }

    for (let podcast of podcasts) {
      // set ansLabel if it was found
      const anslabelIndex = ansState.findIndex(
        (users) => users.user === podcast.owner
      );
      podcast.ansOwnerLabel =
        anslabelIndex !== -1
          ? `${ansState[anslabelIndex].currentLabel}.ar`
          : ``;

      delete podcast["logs"];
      podcast.superAdmins = factory.superAdmins;
      res.push(podcast);
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

  const podcastObject = await removeBlacklists(podcasts[podcastIndex]);
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

export async function getTotalPermacastSize() {
  const response = await getPodcasts();

  if (response === "e30") {
    return base64url(JSON.stringify({ total_byte_size: "pending" }));
  }

  const podcasts = JSON.parse(base64url.decode(response)).res;
  let totalSize = 0;

  for (let podcast of podcasts) {
    const episodes = podcast["episodes"];

    if (episodes.length === 0) {
      continue;
    }
    const sizeArray = episodes.map((ep) => ep.contentTxByteSize);
    const podcastSize = sizeArray.reduce((a, b) => a + b, 0);
    totalSize += podcastSize;
  }

  const re = {
    total_byte_size: totalSize,
  };
  return base64url(JSON.stringify(re));
}

export async function getProfileFeed(address) {
  const response = await getPodcasts();

  if (response === "e30") {
    return base64url(JSON.stringify({ res: "pending" }));
  }

  const podcasts = JSON.parse(base64url.decode(response)).res;
  const ownedPodcasts = podcasts.filter((podcast) => podcast.owner === address);

  const re = {
    res: ownedPodcasts,
  };

  return base64url(JSON.stringify(re));
}

export async function getEpisodesFeed(to_limit) {
  const response = await getPodcasts();
  let re;

  // default fallback value
  if (to_limit && typeof to_limit !== "number" && to_limit <= 0) {
    to_limit = 50;
  }

  if (response === "e30") {
    return base64url(JSON.stringify({ res: "pending" }));
  }

  const podcasts = JSON.parse(base64url.decode(response)).res;

  const episodes = podcasts.map((podcast) => podcast.episodes).flat();

  const filteredEpisodes = episodes.filter((episode) => episode.isVisible);

  const sortedEpisodes = filteredEpisodes.sort(
    (a, b) => b.uploadedAt - a.uploadedAt
  );

  if (!to_limit) {
    re = {
      res: sortedEpisodes,
    };
  } else {
    re = {
      res: sortedEpisodes.slice(0, to_limit),
    };
  }

  return base64url(JSON.stringify(re));
}

export async function stats() {
  try {
    const size = JSON.parse(base64url.decode(await getTotalPermacastSize()));
    if (size.total_byte_size === "pending") {
      return base64url(
        JSON.stringify({
          total_byte_size: "pending",
          total_episodes_count: "pending",
          last_active_podcast: "pending",
          last_added_episode: "pending",
        })
      );
    }

    const episodesFeed = JSON.parse(base64url.decode(await getEpisodesFeed()));
    const podcastsFeed = JSON.parse(
      base64url.decode(await sort("podcastsactivity"))
    );
    const last_added_episode = episodesFeed["res"][0]?.eid;
    const last_active_podcast = podcastsFeed["res"][0]?.pid;

    const re = {
      total_byte_size: size.total_byte_size,
      total_episodes_count: episodesFeed.res.length,
      last_active_podcast: last_active_podcast,
      last_added_episode: last_added_episode,
    };

    return base64url(JSON.stringify(re));
  } catch (error) {
    console.log(error);
  }
}

export async function polling(blocksNb) {
  try {
    while (true) {
      if (!blocksNb) {
        var blocksNb = 1;
      }

      await cache();
      // in sec
      const EST_BLOCK_TIME = 2 * 60 * 1000 * blocksNb;
      await sleep(EST_BLOCK_TIME);
    }
  } catch (error) {
    console.log(error);
  }
}
