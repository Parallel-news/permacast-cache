export async function handle(state, action) {
  const caller = action.caller;
  const input = action.input;

  const PID_NOT_FOUND = "podast ID not found";
  const EID_NOT_FOUND = "episode ID not found";
  const ERROR_INVALID_CALLER =
    "the caller is not authorized to invoke this function";
  const ERROR_INVALID_ARWEAVE_ID =
    "the given string is a non-valid Arweave TXID/address";
  const ERROR_PID_ALREADY_MASKED =
    "the PID has been already added to masking list";
  const ERROR_EID_ALREADY_MASKED =
    "the PID has been already added to masking list";
  const ERROR_ARWEAVE_NETWORK_UNSTABLE =
    "Arweave network unstable or TX not found/dropped";

  if (input.function === "maskPid") {
    const pid = input.pid;

    _validatePid(pid);

    if (!(await _isTransactionOwner(pid, caller))) {
      throw new ContractError(ERROR_INVALID_CALLER);
    }

    state.podcasts.push(pid);

    return { state };
  }

  if (input.function === "maskEid") {
    const eid = input.eid;

    _validateEid(eid);

    if (!(await _isTransactionOwner(eid, caller))) {
      throw new ContractError(ERROR_INVALID_CALLER);
    }

    state.episodes.push(eid);

    return { state };
  }

  if (input.function === "unmaskPid") {
    const pid = input.pid;

    _validateAddress(pid);

    if (!state.podcasts.includes(pid)) {
      throw new ContractError(PID_NOT_FOUND);
    }

    if (!(await _isTransactionOwner(pid, caller))) {
      throw new ContractError(ERROR_INVALID_CALLER);
    }

    const pidIndex = state.podcasts.findIndex((id) => id === pid);
    state.podcasts.splice(pidIndex, 1);

    return { state };
  }

  if (input.function === "unmaskEid") {
    const eid = input.eid;

    _validateAddress(eid);

    if (!state.episodes.includes(eid)) {
      throw new ContractError(EID_NOT_FOUND);
    }

    if (!(await _isTransactionOwner(eid, caller))) {
      throw new ContractError(ERROR_INVALID_CALLER);
    }

    const eidIndex = state.episodes.findIndex((id) => id === eid);
    state.episodes.splice(eidIndex, 1);

    return { state };
  }

  function _validateAddress(address) {
    if (typeof address !== "string" || !/[a-z0-9_-]{43}/i.test(address)) {
      throw new ContractError(ERROR_INVALID_ARWEAVE_ID);
    }
  }

  function _validatePid(pid) {
    _validateAddress(pid);

    if (state.podcasts.includes(pid)) {
      throw new ContractError(ERROR_PID_ALREADY_MASKED);
    }
  }

  function _validateEid(eid) {
    _validateAddress(eid);

    if (state.episodes.includes(eid)) {
      throw new ContractError(ERROR_EID_ALREADY_MASKED);
    }
  }

  async function _isTransactionOwner(txid, address) {
    try {
      const tx = await SmartWeave.unsafeClient.transactions.get(txid);
      const base64Owner = tx.owner;
      const owner = SmartWeave.unsafeClient.wallets.ownerToAddress(base64Owner);

      return owner === address || state.superAdmins.includes(address);
    } catch (error) {
      throw new ContractError(ERROR_ARWEAVE_NETWORK_UNSTABLE);
    }
  }
}
