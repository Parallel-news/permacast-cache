## Guide To Interact With The Masking Contract

In this guide, interactiona are done via [SmartWeave CLI](https://github.com/ArweaveTeam/SmartWeave)

### install smartweave

```sh
npm install -g smartweave
```
### Masking smartcontract Address
- v0.0.1 (current): `rFD_owQauwCYgahb4nD2WaMW4tIstmg47gN1QtRhcpE`

## Mask a PID (Podcast ID)

```sh
smartweave write rFD_owQauwCYgahb4nD2WaMW4tIstmg47gN1QtRhcpE --input '{"function": "maskPid", "pid": "PID_TO_MASK_IT"}' --key-file PATH-TO-YOUR-WALLET.json
```

## Mask an EID (Podcast EID)

```sh
smartweave write rFD_owQauwCYgahb4nD2WaMW4tIstmg47gN1QtRhcpE --input '{"function": "maskEid", "eid": "EID_TO_MASK_IT"}' --key-file PATH-TO-YOUR-WALLET.json
```

## Unmasking a PID

```sh
smartweave write rFD_owQauwCYgahb4nD2WaMW4tIstmg47gN1QtRhcpE --input '{"function": "unmaskPid", "pid": "PID_TO_UNMASK"}' --key-file PATH-TO-YOUR-WALLET.json
```

## Unmasking an EID

```sh
smartweave write rFD_owQauwCYgahb4nD2WaMW4tIstmg47gN1QtRhcpE --input '{"function": "unmaskEid", "eid": "EID_TO_UNMASK"}' --key-file PATH-TO-YOUR-WALLET.json
```

## Notes
- Only the `eid` or `pid` TX's owner can mask or unmask it. Masking's contract admins are also permissioned to interact with the contract on behalf of users.
- A non-zero balance of AR in your wallet is required to interact with the contract (Arweave network fees - aka gas).