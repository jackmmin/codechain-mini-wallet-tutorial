import { SDK } from "codechain-sdk";    // sdk 모듈 불러오기

import { Tracer } from "../tracer";
import { PlatformAddress } from "codechain-primitives/lib";

export default async function init(
    sdk: SDK,
    tracer: Tracer,
    args: string[]
) {
    let address = tracer.state.address;
    if( address === undefined ) {
        const platformAddress = await sdk.key.createPlatformAddress();
        const assetAddress = await sdk.key.createAssetAddress();
        address = {
            platformAddress,    // platformAddress, 는 platformAddress: platformAddress 와 같은 의미
            assetAddress,
        };
        tracer.state.address = address;
    }
    console.log( "Platform address:", address.platformAddress.toString() );
    console.log( "Asset address:", address.assetAddress.toString() );
}