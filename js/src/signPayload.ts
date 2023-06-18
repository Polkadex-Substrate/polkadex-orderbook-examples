import {u8aToHex} from "@polkadot/util";
import {ApiPromise} from "@polkadot/api";
import {KeyringPair} from "@polkadot/keyring/types";
import {Codec} from "@polkadot/types/types";

export const signPayload = (
    api: ApiPromise,
    userKeyring: KeyringPair,
    payload: Codec
): { "Sr25519": string } => {
    const signatureU8 = userKeyring.sign(payload.toU8a(), {withType: true});
    const signature = u8aToHex(signatureU8);
    const _multiSig: any = api.createType("MultiSignature", signature);
    return {
        Sr25519: _multiSig.toJSON().sr25519.slice(2),
    };
};