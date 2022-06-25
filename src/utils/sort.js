import { getPodcasts } from "./cache.js";
import base64url from "base64url";

async function episodesCountSorting() {
  try {
    const EMPTY_OBJECT = "e30";
    const encodedPermacast = await getPodcasts();

    if (encodedPermacast === EMPTY_OBJECT) {
      return EMPTY_OBJECT;
    }

    const decodedPermacast = JSON.parse(base64url.decode(encodedPermacast));
    const sortedState = decodedPermacast.res.sort(
      (a, b) => b.episodes.length - a.episodes.length
    );

    return base64url(JSON.stringify({ res: sortedState }));
  } catch (error) {
    console.log(error);
  }
}

async function podcastsActivitySorting() {
  try {
    const EMPTY_OBJECT = "e30";
    const encodedPermacast = await getPodcasts();

    if (encodedPermacast === EMPTY_OBJECT) {
      return EMPTY_OBJECT;
    }

    const decodedPermacast = JSON.parse(base64url.decode(encodedPermacast));

    for (const podcast of decodedPermacast.res) {
      const uploadsTimestamp = podcast.episodes.map(
        (episode) => episode?.uploadedAt
      );
      podcast.latestUpload = Math.max(...uploadsTimestamp);
    }

    const sortedState = decodedPermacast.res.sort(
      (a, b) => b.latestUpload - a.latestUpload
    );
    return base64url(JSON.stringify({ res: sortedState }));
  } catch (error) {
    console.log(error);
  }
}

async function nonEmptypodcastsActivitySorting() {
  try {
    const EMPTY_OBJECT = "e30";

    const encodedSortedState = await podcastsActivitySorting();

    if (encodedSortedState === EMPTY_OBJECT) {
      return EMPTY_OBJECT;
    }

    const decodedSortedState = JSON.parse(
      base64url.decode(encodedSortedState)
    )?.res;
    const filteredState = decodedSortedState.filter(
      (pod) => pod.episodes.length > 0
    );

    return base64url(JSON.stringify({ res: filteredState }));
  } catch (error) {
    console.log(error);
  }
}

async function nonEmptyepisodesCountSorting() {
  try {
    const EMPTY_OBJECT = "e30";

    const encodedSortedState = await episodesCountSorting();

    if (encodedSortedState === EMPTY_OBJECT) {
      return EMPTY_OBJECT;
    }

    const decodedSortedState = JSON.parse(
      base64url.decode(encodedSortedState)
    )?.res;
    const filteredState = decodedSortedState.filter(
      (pod) => pod.episodes.length > 0
    );

    return base64url(JSON.stringify({ res: filteredState }));
  } catch (error) {
    console.log(error);
  }
}

export async function sort(type) {
  try {
    switch (type) {
      case "episodescount":
        return await episodesCountSorting();
      case "podcastsactivity":
        return await podcastsActivitySorting();
      case "episodescount1":
        return await nonEmptyepisodesCountSorting();
      case "podcastsactivity1":
        return nonEmptypodcastsActivitySorting();
      default:
        return await getPodcasts();
    }
  } catch (error) {
    console.log(error);
  }
}
