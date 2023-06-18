
from substrateinterface import Keypair, KeypairType, SubstrateInterface
from decimal import Decimal
import time
import json
from constants import *
from scaleTypes import SCALE_TYPES

def main():
    #connect to chain
    substrate = SubstrateInterface(url="wss://mainnet.polkadex.trade",ss58_format=POLKADEX_SS58_PREFIX,type_registry=SCALE_TYPES,auto_discover=False)
    
    # initalize the trader and the market
    main = Keypair.create_from_uri('//Bob', ss58_format=POLKADEX_SS58_PREFIX)
    trader = Keypair.create_from_uri('//Alice', ss58_format=POLKADEX_SS58_PREFIX)
    market = "PDEX-1"

    # create a Bid Limit order with price 5 and quantity 10
    price = '5'
    quantity = '10'
    #example use 32 byte hex of zeroes
    client_order_id = "0xd6c6e89e4b5aad80b63da4b4f87d68bf0affc53521c4f0ec61e897147bc743b3"
    timestamp = int(1687126073)
    order_parameters = {
            "user": trader.ss58_address,
            "main_account": main.ss58_address,
            "pair": market,
            "qty": quantity, #should be zero for market-bid
            "price": price, 
            "quote_order_quantity": ZERO, #non zero only for market-bid
            "timestamp": timestamp,
            "client_order_id": client_order_id,
            "order_type": "LIMIT",
            "side": "Bid",
        }

    place_order_request = substrate.create_scale_object("OrderPayload").encode(order_parameters)

    #0xd6c6e89e4b5aad80b63da4b4f87d68bf0affc53521c4f0ec61e897147bc743b3d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a4818504445582d31010028302e3030303030303030083130043539808f6400000000
    print("hex encoding of order payload")
    print(place_order_request.to_hex())

    signature = trader.sign(place_order_request)
    payloadJson = [order_parameters, {"Sr25519": signature.hex()}]
    payload = json.dumps(payloadJson)

    print("place order gql payload")
    print(payload)

    #cancel order
    order_id = "0x638d0490000000004b7cdeca2fe41a1b6411000000158fb5610df6aa553bfedb"
    cancel_order_request = substrate.create_scale_object('H256').encode(order_id)
    signature = trader.sign(cancel_order_request)
    cancelPayloadJson = [order_id, main.ss58_address, trader.ss58_address, market, {"Sr25519": signature.hex()}]
    cancelPayload = json.dumps(cancelPayloadJson)

    print("cancel order gql payload")
    print(cancelPayload)



if __name__ == "__main__":
    main()