import {ApiPromise, Keyring, WsProvider} from "@polkadot/api";
import {scaleTypes} from "./scaleTypes";
import {createOrderPayload} from "./createOrderPayload";
import {UNIT} from "./consts";
import {signPayload} from "./signPayload";
import {createCancelOrderPayloadSigned} from "./createCancelOrderPayload";


async function main() {
    // initialize
    const provider = new WsProvider("wss://mainnet.polkadex.trade");
    const api = await ApiPromise.create({provider, types: scaleTypes});
    const keyring = new Keyring({type: "sr25519"})

    const market = "PDEX-1"
    //import a test main account using a known mnemonic
    const main = keyring.addFromUri("//Bob")
    //import a test trading account using a known mnemonic
    const trader = keyring.addFromUri("//Alice");

    //create a Bid limit order for price 5 and qty 10
    const price = 5 * UNIT;
    const quantity = 10 * UNIT;
    const clientOrderId = "0xd6c6e89e4b5aad80b63da4b4f87d68bf0affc53521c4f0ec61e897147bc743b3";
    const timestamp = 1687126073
    const orderPayload = createOrderPayload({
        api,
        mainAddress: main.address,
        tradeAddress: trader.address,
        price,
        quantity, // non-zero for all orders types except market-bids
        quoteOrderQuantity: 0, // non-zero for market-bids
        clientOrderId,
        market,
        side: "Bid",
        timestamp,
        type: "LIMIT"
    })

    //0xd6c6e89e4b5aad80b63da4b4f87d68bf0affc53521c4f0ec61e897147bc743b3d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a4818504445582d31000128302e303030303030303028302e30303030303030302435303030303030303039808f6400000000
    console.log("hex encoding of order:")
    console.log(orderPayload.toHex());

    // sign the orderPayload created using traders private key.
    let signature = signPayload(api, trader, orderPayload)

    const payloadJson = [orderPayload, signature]

    //payload to be passed to graphql requests.
    const payload = JSON.stringify(payloadJson)

    console.log("place order gql payload: ")
    console.log(payload)

    //cancel order
    let orderId = "0x638d0490000000004b7cdeca2fe41a1b6411000000158fb5610df6aa553bfedb";
    const  {signature : cancelSignature} = createCancelOrderPayloadSigned(api, trader, orderId, market);
    const cancelPayloadJson = [orderId, main.address, trader.address, market, cancelSignature]
    const cancelPayload = JSON.stringify(cancelPayloadJson)

    console.log("cancel order gql payload:")
    console.log(cancelPayload)
}

main().finally(console.log)