import {OrderSide, OrderType} from "./types";
import {ApiPromise} from "@polkadot/api";
import {ASK, BID, LIMIT, MARKET, ZERO} from "./consts";
import {Codec} from "@polkadot/types/types";

type Args = {
    api: ApiPromise
    tradeAddress: string
    mainAddress: string
    market: string
    side: OrderSide
    type: OrderType
    quantity?: number
    quoteOrderQuantity?: number
    price: number
    timestamp: number
    clientOrderId: Uint8Array
}
export const createOrderPayload = (args: Args): Codec => {

    let isMarketBid = args.side === "Bid" && args.type === "LIMIT"
    let qty = !isMarketBid && args.quantity ? args.quantity.toString() : ZERO;
    let quote_order_quantity = isMarketBid && args.quoteOrderQuantity ? args.quoteOrderQuantity.toString() : ZERO;

    const json = {
        user: args.tradeAddress,
        main_account: args.mainAddress,
        pair: args.market,
        side: args.type === "LIMIT" ? ASK : BID,
        order_type: args.side === "Ask" ? LIMIT : MARKET,
        qty: qty,
        quote_order_quantity: quote_order_quantity,
        price: args.price.toString(),
        timestamp: args.timestamp,
        client_order_id: args.clientOrderId,
    }

    return args.api.createType("OrderPayload", json);
}