import { SDK } from "codechain-sdk";    // sdk 모듈 불러오기

import { Tracer } from "../tracer";
import { PlatformAddress } from "codechain-primitives/lib";

export default async function sendCCC(
    sdk: SDK,
    tracer: Tracer,
    args: string[]
) {
    const address = tracer.state.address;
    if( address === undefined ) {
        throw new Error( "init 을 하세요" );
    }

    const receiver = PlatformAddress.ensure( args[ 0 ] );
    const quantity = parseInt( args[ 1 ], 10 );

    console.log( "Sender:", address.platformAddress.toString() );
    console.log( "Receiver:", receiver.toString() );
    console.log( "Quantity:", quantity.toLocaleString() );

    const pay = sdk.core.createPayTransaction( {
        recipient: receiver,
        quantity,   //보내는 용도의 fee, 노드를 운영하는 운영자에게 주는 fee
    });    // 받는사람 액수 지정하면 pay transaction 생성됨
    const signedTx = await sdk.key.signTransaction( pay, { //끝나면 sign된 트랜잭션 생성 끝.
        account: address.platformAddress,
        fee: 100,   // fee는 100이상 주어야한다.
        seq: await sdk.rpc.chain.getSeq( address.platformAddress ), //트랜잭션을 순서대로 수행하기 위해. 트랜잭션 순서 보장
    });
    const txHash = await sdk.rpc.chain.sendSignedTransaction( signedTx );
    console.log( "Pay tx:", txHash.toString() );
}