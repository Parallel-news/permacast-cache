import { arweave, readContract } from "./arweave.js";
import { BLACKLIST, MASKING_CONTRACT } from "./constants/blacklist.js";
import { V2_V3_ARRAY } from "./constants/v2_v3_conversion.js";
import { ANS_SWC_ID } from "./constants/ans_address.js";
import { makeQueries } from "./gql.js";
import base64url from "base64url";
import axios from "axios";

export async function getFactoriesObjects() {
  const factories = [];
  const factoriesObjects = await makeQueries();

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
  const blacklistedPodcasts = state.podcasts.filter(
    (podObj) => !podObj.isVisible
  );

  if (blacklistedPodcasts.length > 0) {
    const filteredPodcasts = state.podcasts.filter((pod) => pod.isVisible);

    state.podcasts = filteredPodcasts;
    return state;
  }

  return state;
}

export async function getFactoriesState() {
  const factoriesObj = await getFactoriesObjects();
  const states = [];
  for (let factory of factoriesObj) {
    const v2Possibility = V2_V3_ARRAY.findIndex((f) => f.new === factory.id);

    const unfiliteredState = await getStateOf(factory.id);

    if (v2Possibility !== -1) {
      console.log("\n\n\n\n\n\n\nADDED A NEW CHILD\n\n\n\n\n\n\n");
      unfiliteredState.podcasts.forEach(
        (podcast) => (podcast.newChildOf = V2_V3_ARRAY[v2Possibility].new)
      );
    }

    // set factory metadata
    if (unfiliteredState) {
      const state = await blacklistFactoryPodcast(unfiliteredState);

      state.factory_id = factory.id;
      state.owner = factory.owner;
      state.factoryCreationTimestamp = factory.timestamp;
      states.push(state);
    }
  }

  const response = {
    res: states,
  };
  return base64url(JSON.stringify(response));
}

export async function getStateOf(contractId) {

  try {
    const contractState = await readContract(contractId);

    return contractState;
  } catch (error) {
    console.log(error);
    console.log(`SMARTWEAVE ERROR: ${error.name} : ${error.description}`);
    return false;
  }
}
export async function getAnsState() {
  try {
    const users = (await axios.get("https://ans-stats.decent.land/users"))?.data
      .res;

    return users;
  } catch (error) {
    const users = (await getStateOf(ANS_SWC_ID))?.users;

    return users;
    console.log(error);
  }
}
