export const scaleTypes = {
    Address: "MultiAddress",
    ShardIdentifier: "H256",
    Balance: "u128",
    BalanceOf: "Balance",
    OrderPayload: {
        client_order_id: "H256",
        user: "AccountId",
        main_account: "AccountId",
        pair: "String",
        side: "OrderSide",
        order_type: "OrderType",
        quote_order_quantity: "String", // Quantity is defined in base asset
        qty: "String",
        price: "String", // Price is defined in quote asset per unit base asset
        timestamp: "i64",
    },
    order_id: "H256",
    OrderSide: {
        _enum: {
            Ask: null,
            Bid: null,
        },
    },
    OrderType: {
        _enum: {
            LIMIT: null,
            MARKET: null,
        },
    },
    WithdrawPayload: {
        asset_id: "AssetId",
        amount: "String",
        timestamp: "i64",
    },
};