import RSS from "rss";
import base64url from "base64url";
import { getEpisodes } from "./cache.js";
import axios from "axios";

export async function generateRss(pid) {
  const podcastObject = await getEpisodes(pid);

  if (podcastObject === "e30") {
    const feed = new RSS();
    // return empty XML string
    return feed.xml({ indent: true });
  }

  const podcast = JSON.parse(base64url.decode(podcastObject));
  const IMG = `https://arweave.net/${podcast.cover}`;
  const IMG_REDICRECT = await getTxRedirectUrl(podcast.cover);
  const categories = podcast.categories.toString().replaceAll("&", "&amp;").split(",");
  const feed = new RSS({
    custom_namespaces: { itunes: "http://www.itunes.com/dtds/podcast-1.0.dtd" },
    title: podcast.podcastName,
    description: podcast.description,
    managingEditor: podcast.email,
    categories: categories,
    image_url: IMG_REDICRECT,
    site_url: `https://legacy.permacast.dev/#/podcasts/${podcast.pid}`,
    language: podcast.language,
    custom_elements: [
      { "itunes:image": { _attr: { href: IMG_REDICRECT } } },
      { "itunes:explicit": podcast.explicit },
      {
        "itunes:category": [
          {
            _attr: {
              text: categories
            }
          }]
      },
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


async function getTxRedirectUrl(txid) {
  try {
    const tx = await axios.get(`https://arweave.net/${txid}`);

    return tx?.request?.res?.responseUrl;
  } catch (error) {
    console.log(error);
    return `https://arweave.net/${txid}`;
  }
}
