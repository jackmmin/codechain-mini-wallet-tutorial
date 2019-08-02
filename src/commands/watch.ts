import { SDK } from "codechain-sdk";    // sdk 모듈 불러오기

import { Tracer } from "../tracer";
import { Pay, PlatformAddress, U64 } from "codechain-sdk/lib/core/classes";

export default async function watch(
    sdk: SDK,
    tracer: Tracer,
    args: string[]
) {
    let from;
    if( args.length > 0 ) {
        from = parseInt( args[ 0 ], 10 );
    } else {
        from = await sdk.rpc.chain.getBestBlockNumber();
    }

    // const blockNumber = parseInt( args[ 0 ], 10 );

    for( let blockNumber = from; ; blockNumber++ ) {
        const block = await eventuallyGetBlock( sdk, blockNumber );
    
        console.log( "Block number:", block.number );
        console.log( "Block hash:", block.hash.toString() );

        for( const tx of block.transactions ) { // pay 트랜잭션이 발생할 때 출력한다.
            console.log( "Tx", tx.unsigned.type(), tx.hash().toString() );
            if( tx.unsigned.type() === "pay" ) {
                const { receiver, quantity }: {
                    receiver: PlatformAddress,
                    quantity: U64
                } = tx.unsigned as any;
                const sender = tx.getSignerAddress( {
                    networkId: "wc",
                });
                console.log( "  Sender:", sender.toString() );
                console.log( "  Receiver:", receiver.toString() );
                console.log( "  Quantity:", quantity.toString() );
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