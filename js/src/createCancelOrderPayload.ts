import {ApiPromise} from "@polkadot/api";
import {KeyringPair} from "@polkadot/keyring/types";
import {signPayload} from "./signPayload";

export const createCancelOrderPayloadSigned = (
    api: ApiPromise,
    userKeyring: KeyringPair,
    orderId: string,
    market: string
) => {
    const orderIdCodec = api.createType("order_id", orderId);
    const signature = signPayload(api, userKeyring, orderIdCodec);
    return {
        orderId: orderIdCodec,
        account: userKeyring.address,
        pair: market,
        signature: signature,
    };
};