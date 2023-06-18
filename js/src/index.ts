import {ApiPromise, Keyring, WsProvider} from "@polkadot/api";
import {scaleTypes} from "./scaleTypes";
import {createOrderPayload} from "./createOrderPayload";
import {UNIT} from "./consts";
import {getNewClientId} from "./createClientOrderId";
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
    const orderPayload = createOrderPayload({
        api,
        mainAddress: main.address,
        tradeAddress: trader.address,
        price,
        quantity,
        quoteOrderQuantity: 0,
        clientOrderId: getNewClientId(),
        market,
        side: "Bid",
        timestamp: new Date().getTime(),
        type: "LIMIT"
    })

    //0x8d73e21ecc09a1eb6b2b50b81a4220d490590582c759c4cd33267e0143d6c0dbd43593c715fdd31c61141abd04a99fd6822c8558854ccde
    //39a5684e7a56da27d8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a4818504445582d31000128302e30303030
    //3030303028302e303030303030303024353030303030303030d2a547cf88010000
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