import { SDK } from "codechain-sdk";    // sdk 모듈 불러오기

import { Tracer } from "../tracer";
import { Pay, PlatformAddress, U64 } from "codechain-sdk/lib/core/classes";
import account from "./account";

export default async function watch(
    sdk: SDK,
    tracer: Tracer,
    args: string[]
) {
    const address = tracer.state.address;
    if( address === undefined ) {
        throw new Error( "init을 하세요" );
    }

    let from;
    if( args.length > 0 ) {
        from = parseInt( args[ 0 ], 10 );
    } else {
        from = await sdk.rpc.chain.getBestBlockNumber();
    }

    for( let blockNumber = from; ; blockNumber++ ) {
        const block = await eventuallyGetBlock( sdk, blockNumber );

        for( const tx of block.transactions ) { // pay 트랜잭션이 발생할 때 출력한다.
            // console.log( "Tx", tx.unsigned.type(), tx.hash().toString() );
            if( tx.unsigned.type() === "pay" ) {
                const { receiver, quantity }: {
                    receiver: PlatformAddress,
                    quantity: U64
                } = tx.unsigned as any;
                const sender = tx.getSignerAddress( {
                    networkId: "wc",
                });

                if( sender.toString() == address.platformAddress.toString() ) {
                    // 내가 보낸 pay 트랜잭션
                    console.log( {
                        type: "send",
                        receiver: receiver.toString(),
                        quantity: quantity.toString(),
                        fee: tx.unsigned.fee()!.toLocaleString(),
                    });
                }
                if( receiver.toString() == address.platformAddress.toString() ) {
                    // 내가 받은 pay 트랜잭션
                    console.log( {
                        type: "receive",
                        sender: sender.toString(),
                        quantity: quantity.toString(),
                    });
                }
            }
        }
    }
}

async function eventuallyGetBlock( sdk: SDK, blockNumber: number ) {
    while( true ) {
        const block = await sdk.rpc.chain.getBlock( blockNumber );
        if( block === null ) {
            await sleep( 2_000 );
            continue;
        }
        return block;
    }
}

function sleep( ms: number ): Promise<void> {
    return new Promise( ( resolve, error ) => {
        setTimeout(
            () => resolve(),
            ms );
    });
}