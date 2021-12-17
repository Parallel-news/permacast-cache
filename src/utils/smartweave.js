import { smartweave, arweave } from "./arweave.js";
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

export async function getFactoriesState() {
  const factoriesObj = await getFactoriesObjects();
  const states = [];
  for (let factory of factoriesObj) {
    const state = await getStateOf(factory.id);
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
