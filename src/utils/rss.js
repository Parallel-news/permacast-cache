import RSS from "rss";
import base64url from "base64url";
import { getEpisodes } from "./cache.js";

export async function generateRss(pid) {
  const podcastObject = await getEpisodes(pid);

  if (podcastObject === "e30") {
    const feed = new RSS();
    // return empty XML string
    return feed.xml({ indent: true });
  }

  const podcast = JSON.parse(base64url.decode(podcastObject));
  const IMG = `https://arweave.net/${podcast.cover}`;

  const feed = new RSS({
    custom_namespaces: { itunes: "http://www.itunes.com/dtds/podcast-1.0.dtd" },
    title: podcast.podcastName,
    description: podcast.description,
    managingEditor: podcast.email,
    categories: podcast.categories,
    image_url: IMG,
    site_url: `https://permacast.net/#/podcasts/${podcast.pid}`,
    language: podcast.language,
    custom_elements: [
      { "itunes:image": { _attr: { href: IMG } } },
      { "itunes:explicit": podcast.explicit },
      { "itunes:author": podcast.author },
      {
        "itunes:owner": [
          { "itunes:email": podcast.email },
          { "itunes:name": podcast.podcastName },
        ],
      },
    ],
  });

  for (let episode of podcast.episodes) {
    feed.item({
      title: episode.episodeName,
      description: episode.description,
      enclosure: {
        url: `https://arweave.net/${episode.contentTx}`,
        size: episode.contentTxByteSize,
        type: episode.type,
      },
      guid: episode.eid,
      date: episode.uploadedAt * 1000,
    });
  }

  return feed.xml({ indent: true });
}
