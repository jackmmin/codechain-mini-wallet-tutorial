import { SDK } from "codechain-sdk";    // sdk 모듈 불러오기

import { Tracer } from "../tracer";

export default async function hello(
    sdk: SDK,
    tracer: Tracer,
    args: string[]
    ) {
    console.log( `Hello, ${ tracer.state.nickname }!` );
    if( args.length > 0 ) {
        const name = args[ 0 ];
        console.log( `이름이 ${ name }(으)로 바뀌었네요!`)
        tracer.state.nickname = name;
    }
    // console.log( args );
    // const bestBlockNumber = name;
    const bestBlockNumber = await sdk.rpc.chain.getBestBlockNumber(); // sdk가 서버에 요청해서 어쩌구저쩌구
    console.log( "Best block number:", bestBlockNumber );
}