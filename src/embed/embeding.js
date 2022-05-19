import { getPodcasts } from "../utils/cache.js";
import { defaultEmbed } from "../utils/constants/defaultEmbed.js";
import base64url from "base64url";

export async function getEpisodeMetadata(eid) {
  try {
    const encodedState = await getPodcasts();
    const state = JSON.parse(base64url.decode(encodedState))?.res;

    if (!state) {
      return defaultEmbed;
    }

    const existenceOfEpParent = state.findIndex((pod) =>
      pod.episodes.find((ep) => ep["eid"] === eid)
    );

    if (existenceOfEpParent === -1) {
      return defaultEmbed;
    }

    const episodeIndexInParent = state[existenceOfEpParent].episodes.findIndex(
      (ep) => ep["eid"] === eid
    );

    const podcast = state[existenceOfEpParent];
    const episode = podcast["episodes"][episodeIndexInParent];

    const episodeMetadata = {
      episode_name: episode.episodeName,
      episode_url: `https://arweave.net/${episode.contentTx}`,
      episode_desc: episode.description,
      episode_podcast: podcast.podcastName,
      podcast_cover: `https://arweave.net/${podcast.cover}`,
    };

    return episodeMetadata;
  } catch (error) {
    console.log(`${error.name} : ${error.description}`);
  }
}
