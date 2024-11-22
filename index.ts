import axios from "axios";
import { Connection, PublicKey, TransactionSignature, ParsedTransaction } from '@solana/web3.js';

// 2. GMGN.ai Integration:
const GMGN_TOKEN_LISTING_API = "https://gmgn.ai/api/gettokendata" // mock url

interface tokenData {
    name: string,
    address: string,
    twitter: string,
    websiet: string,
    telegram: string,
    age: string,
    liq: string,
    holders: string,
    tx: number,
    vol: number,
    price: number,
    increase_1: number,
    increase_5: number,
    increase_60: number,
    degen_audit: {
        NoMint: boolean,
        Blacklist: boolean,
        Burnt: boolean,
        top_10: number,
        insiders: number
    }
}

// get token listing
// There is no available api that get token listing in GMGN.ai 
const getTokenListing = () => {
    axios.get(`${GMGN_TOKEN_LISTING_API}`)
        .then(response => {
            // output token listing
            console.log(response.data)
        })
        .catch(err => {
            console.log(err)
        })
};

// log new token listing
const logNewTokenListing = () => { };

// 3.	Basic Bot Functionality:
const rpcURL = `https://prettiest-alpha-layer.solana-mainnet.quiknode.pro/299c8791dd626fb1352a0fd06e92afe2b95aa3cc`
const connection = new Connection(rpcURL, "confirmed");
function subscribeToTransaction(mint: PublicKey) {
    const publicKey = new PublicKey(mint);

    connection.onLogs(publicKey, (log) => {
        // return new created token info;
        if (log.logs.includes("Program 6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P invoke [1]") && log.logs.includes("Program log: Instruction: Create")) {
            // console.log(log);
            // return;
            fetchTransaction(log.signature);
        }
    })
}

async function fetchTransaction(tx: TransactionSignature) {
    if (!tx) return;

    connection.getParsedTransaction(tx, {
        maxSupportedTransactionVersion: 0
    }).then(async (txdata: any) => {
        console.log(`New token ${txdata.transaction.message.instructions[4].parsed?.info?.mint} created`)

        // const tokenMintInfo = await splToken.getMint(connection, new PublicKey(txdata.transaction.message.instructions[4].parsed?.info?.mint));

        console.log(txdata) // we can get new created token info
    })
}

function getCreateTransaction() {
    console.log("Start trigger new transaction for a token creation from pumps");
    subscribeToTransaction(new PublicKey("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"))  //This is the smart contract of pump.fun
}

getCreateTransaction()