import { smartweave, arweave } from "./arweave.js";
import { BLACKLIST } from "./constants/blacklist.js";
import { readContract } from "smartweave";
import { gqlTemplate, permacastDeepGraphs } from "./gql.js";
import base64url from "base64url";

export async function getFactoriesObjects() {
  const factories = [];
  const factoriesObjects = await gqlTemplate(permacastDeepGraphs.factories);

  for (let factory of factoriesObjects) {
    factories.push({
      id: factory.id,
      owner: factory.owner,
      timestamp: factory.timestamp,
    });
  }

  return factories;
}

async function blacklistFactoryPodcast(state) {
  // blacklist a podcast based on its pid
  // remove the podcast object from the factory's
  // state and return the new state if blacklist
  // was found
  const blacklistedPodcasts = BLACKLIST.podcasts;
  const blacklistedPodcastIndex = state.podcasts.findIndex((podObj) =>
    blacklistedPodcasts.includes(podObj.pid)
  );
  if (blacklistedPodcastIndex !== -1) {
    state.podcasts.splice(blacklistedPodcastIndex, 1);
    return state;
  }

  return state;
}

export async function getFactoriesState() {
  const factoriesObj = await getFactoriesObjects();
  const states = [];
  for (let factory of factoriesObj) {
    const unfiliteredState = await getStateOf(factory.id);
    const state = await blacklistFactoryPodcast(unfiliteredState);
    // set factory metadata
    state.factory_id = factory.id;
    state.owner = factory.owner;
    state.factoryCreationTimestamp = factory.timestamp;

    states.push(state);
  }

  const response = {
    res: states,
  };
  return base64url(JSON.stringify(response));
}

async function getStateOf(contractId) {
//   const contract = smartweave.contract(contractId);
//   const contractState = (await contract.readState()).state;
  const contractState = await readContract(arweave, contractId);

  return contractState;
}
