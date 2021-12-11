import Arweave from "arweave";
import { SmartWeaveNodeFactory } from "redstone-smartweave";

export const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
  timeout: 20000,
  logging: false,
});

export const smartweave = SmartWeaveNodeFactory.memCached(arweave);





