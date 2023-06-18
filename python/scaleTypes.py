SCALE_TYPES = {
    "runtime_id": 1,
    "versioning": [],
    "types": {
        "OrderPayload": {
            "type": "struct",
            "type_mapping": [
                ["client_order_id", "H256"],
                ["user", "AccountId"],
                ["main_account", "AccountId"],
                ["pair", "String"],
                ["side", "OrderSide"],
                ["order_type", "OrderType"],
                ["quote_order_quantity", "String"],
                ["qty", "String"],
                ["price", "String"],
                ["timestamp", "i64"],
            ],
        },
        "order_id": "H256",
        "OrderSide": {
            "type": "enum",
            "type_mapping": [
                ["Ask", "Null"],
                ["Bid", "Null"],
            ],
        },
        "OrderType": {
            "type": "enum",
            "type_mapping": [
                ["LIMIT", "Null"],
                ["MARKET", "Null"],
            ],
        },
        "EcdsaSignature": "[u8; 65]",
        "Ed25519Signature": "H512",
        "Sr25519Signature": "H512",
        "AnySignature": "H512",
        "MultiSignature": {
            "type": "enum",
            "type_mapping": [
                ["Ed25519", "Ed25519Signature"],
                ["Sr25519", "Sr25519Signature"],
                ["Ecdsa", "EcdsaSignature"],
            ],
        },
    },
}
