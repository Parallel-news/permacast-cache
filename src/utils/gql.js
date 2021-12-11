import axios from "axios";

export const permacastDeepGraphs = {
  factories: {
    query: `query {
  transactions(
    tags: [
        { name: "Protocol", values: "permacast-testnet-v3"},
        { name: "Action", values: "launchCreator"},
        { name: "Contract-Src", values: "KrMNSCljeT0sox8bengHf0Z8dxyE0vCTLEAOtkdrfjM"}
        ]
    first: 250
  ) {
    edges {
      node {
        id
        owner { address }
        tags { name value }
        block { timestamp }

      }
    }
  }
}`,
  },
};

export function factoryMetadataGraph(factory_id) {
  return {
    query: `query {
  transactions(
    tags: [
        { name: "App-Name", values: "SmartWeaveAction"},
        { name: "App-Version", values: "0.3.0"},
        { name: "Contract", values: "${factory_id}"}
        ]
    first: 250
  ) {
    edges {
      node {
        id
        owner { address }
        tags { name value }
        block { timestamp }

      }
    }
  }
}`,
  };
}

export async function gqlTemplate(query) {
  const response = await axios.post("https://arweave.net/graphql", query, {
    headers: { "Content-Type": "application/json" },
  });

  const transactionIds = [];

  const res_arr = response.data.data.transactions.edges;

  for (let element of res_arr) {
    const tx = element["node"];

    transactionIds.push({
      id: tx.id,
      owner: tx.owner.address,
      // pending transactions do not have block value
      timestamp: tx.block ? tx.block.timestamp : Date.now(),
      tags: tx.tags ? tx.tags : [],
    });
  }

  return transactionIds;
}
