import { getPodcasts } from "./cache.js";
import base64url from "base64url";

export async function getPairs() {
  try {
    const result = [];
    const EMPTY_OBJECT = "e30";
    const encodedPermacast = await getPodcasts();

    if (encodedPermacast === EMPTY_OBJECT) {
      return EMPTY_OBJECT;
    }

    const decodedPermacast = JSON.parse(base64url.decode(encodedPermacast));

    for (const podcast of decodedPermacast.res) {
      if (podcast.isVisible) {
        result.push({
          id: podcast.pid,
          title: podcast.podcastName,
          type: "pid",
        });

        for (const episode of podcast.episodes) {
          if (episode.isVisible) {
            result.push({
              id: episode.eid,
              title: episode.episodeName,
              type: "eid",
            });
          }
        }
      }
    }

    return base64url(JSON.stringify({ res: result }));
  } catch (error) {
    console.log(error);
  }
}
