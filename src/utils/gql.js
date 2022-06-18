import axios from "axios";
import { spamFactories } from "./constants/testnet-spam-attack.js";

// export const permacastDeepGraphs = {
//   factories: {
//     query: `query {
//   transactions(
//   block: {min: 0, max: 953792}
//     tags: [
//         { name: "App-Name", values: "SmartWeaveContract"},
//         { name: "Contract-Src", values: "-SoIrUzyGEBklizLQo1w5AnS7uuOB87zUrg-kN1QWw4"},
//         { name: "Permacast-Version", values: "amber"}
//         ]
//     first: 100
//   ) {
//     edges {
//       node {
//         id
//         owner { address }
//         tags { name value }
//         block { timestamp }

//       }
//     }
//   }
// }`,
//   },
// };

// export function factoryMetadataGraph(factory_id) {
//   return {
//     query: `query {
//   transactions(
//   block: {min: 0, max: 953792}
//     tags: [
//         { name: "App-Name", values: "SmartWeaveAction"},
//         { name: "App-Version", values: "0.3.0"},
//         { name: "Contract", values: "${factory_id}"}
//         ]
//     first: 100
//   ) {
//     edges {
//       node {
//         id
//         owner { address }
//         tags { name value }
//         block { timestamp }

//       }
//     }
//   }
// }`,
//   };
// }

// export async function gqlTemplate(query) {
//   const response = await axios.post("https://arweave.net/graphql", query, {
//     headers: { "Content-Type": "application/json" },
//   });

//   const transactionIds = [];

//   const res_arr = response.data.data.transactions.edges;

//   for (let element of res_arr) {
//     const tx = element["node"];

//     transactionIds.push({
//       id: tx.id,
//       owner: tx.owner.address,
//       // pending transactions do not have block value
//       timestamp: tx.block ? tx.block.timestamp : Date.now(),
//       tags: tx.tags ? tx.tags : [],
//     });
//   }

//   return transactionIds;
// }

const factoriesGraph = async (after) => {
  let query = "";
  if (after) {
    query = `query {
            transactions(
                tags: [
                      { name: "App-Name", values: "SmartWeaveContract"},
                      { name: "Contract-Src", values: "-SoIrUzyGEBklizLQo1w5AnS7uuOB87zUrg-kN1QWw4"},
                      { name: "Permacast-Version", values: "amber"}
                      ],
                first: 100,
                after: "${after}"
            ) {
                edges {
                    node {
                        id
                        owner { address }
                        tags { name value }
                        block { timestamp height }
                    },
                cursor
                }
            }
        }`;
  } else {
    query = `query {
            transactions(
                tags: [
                      { name: "App-Name", values: "SmartWeaveContract"},
                      { name: "Contract-Src", values: "-SoIrUzyGEBklizLQo1w5AnS7uuOB87zUrg-kN1QWw4"},
                      { name: "Permacast-Version", values: "amber"}
                      ],
                first: 100
            ) {
                edges {
                    node {
                        id
                        owner { address }
                        tags { name value }
                        block { timestamp height }
                    },
                cursor
                }
            }
        }`;
  }

  const url = "https://arweave.net/graphql";
  const response = await axios.post(
    url,
    { query },
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
  return await response.data;
};

export async function makeQueries() {
  try {
    const firstFetch = await factoriesGraph();
    const firstEdges = firstFetch?.data?.transactions?.edges || [];
    const results = [...firstEdges];
    const finalRes = [];

    if (results.length === 100) {
      const getEdgesLength = () => results.length;

      while (true) {
        const lastCursor = results[getEdgesLength() - 1]?.cursor;

        if (lastCursor) {
          const nextFetch = await factoriesGraph(lastCursor);
          const currentEdges = nextFetch?.data?.transactions?.edges || [];
          const currentEdgeLength = currentEdges.length || 0;

          if (currentEdgeLength === 0) {
            break;
          }

          results.push(...currentEdges);
        }
      }
    }

    const res = results.map((node) => node.node);
    const filteredRes = res.filter((factory) => !spamFactories.includes(factory.id));

    for (const element of filteredRes) {
      finalRes.push({
        id: element.id,
        owner: element.owner.address,
        // pending transactions do not have block value
        timestamp: element.block ? element.block.timestamp : Date.now(),
        blockheight: element.block ? element.block.height : Date.now(),
        tags: element.tags ? element.tags : [],
      });
    }
    return finalRes;
  } catch (error) {
    console.log(error);
  }
}
