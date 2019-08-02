import * as process from "process";     // process 라는 namespace에 담아라.
import hello from "./commands/hello";
import { Tracer } from "./tracer";
import { SDK } from "codechain-sdk";
import init from "./commands/init";
import account from "./commands/account";
import sendCCC from "./commands/sendCCC";
import watch from "./commands/watch";

async function asyncMain() {

    // console.log( process.argv );
    const [ command, ...args ] = process.argv.slice( 2 );

    // console.log( "Args:", args );
    console.log( "Command:", command );
    const sdk = new SDK( {
        server: "https://corgi-rpc.codechain.io",
        networkId: "wc",
        keyStoreType: {
            type: "local",
            path: "./keystore.db",
        },
    });

    const tracer = Tracer.load();

    switch( command ) {
        case "hello": await hello( sdk, tracer, args ); break;
        case "init": await init( sdk, tracer, args ); break;
        case "account": await account( sdk, tracer, args ); break;
        case "sendCCC": await sendCCC( sdk, tracer, args ); break;
        case "watch": await watch( sdk, tracer, args ); break;
        default:
            throw new Error( `Invalid command ${ command }` );
    }

    tracer.save();
}

asyncMain().catch( e => {
    console.error( e );
});