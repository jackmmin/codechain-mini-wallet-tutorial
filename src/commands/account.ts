import { SDK } from "codechain-sdk";    // sdk 모듈 불러오기

import { Tracer } from "../tracer";

export default async function account(
    sdk: SDK,
    tracer: Tracer,
    args: string[]
) {
    const address = tracer.state.address;
    if( address === undefined ) {
        throw new Error( "init 을 하세요" );
    }
    console.log( "Platform address:", address.platformAddress.toString() );
    const ccc = await sdk.rpc.chain.getBalance( address.platformAddress );
    console.log( "Balance:", ccc.toLocaleString(), "CCC" ); // toLocaleString은 천 단위마다 콤마(,)를 찍어준다.
}