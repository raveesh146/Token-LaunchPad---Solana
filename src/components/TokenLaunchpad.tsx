import { useState } from "react";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { createMint } from '@solana/spl-token'
import { Transaction, Keypair, SystemProgram } from '@solana/web3.js'
import { getMinimumBalanceForRentExemptMint, MINT_SIZE, TOKEN_PROGRAM_ID, createInitializeMint2Instruction, } from '@solana/spl-token'
import { createInitializeInstruction, createUpdateFieldInstruction, createRemoveKeyInstruction, pack, TokenMetadata, } from "@solana/spl-token-metadata";
const react = 'react'
export function TokenLaunchpad() {
    const { connection } = useConnection()
    const wallet = useWallet();

    const [metaData, setmetaData] = useState({
        name: "",
        symbol: "",
        image_url: "",
        initial_supply: ""
    })


    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setmetaData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }

    async function createToken() {
        if (!wallet.publicKey){ 
            console.error("Wallet not connected")
            return
        }

        const keypair = Keypair.generate()
        const mintAuthority = wallet.publicKey
        const freezeAuthority = wallet.publicKey
        const lamports = await getMinimumBalanceForRentExemptMint(connection);
        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey,
                newAccountPubkey: keypair.publicKey,
                space: MINT_SIZE,
                lamports,
                programId: TOKEN_PROGRAM_ID//all mint accs are owned by solana token program
            }),
            createInitializeMint2Instruction(keypair.publicKey, 9, mintAuthority, freezeAuthority, TOKEN_PROGRAM_ID),//this instruction will actually shove the data into the mint acc for which space - 82 bytes we created
        );

        transaction.feePayer = wallet.publicKey
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash


        transaction.partialSign(keypair)

        const response = await wallet.sendTransaction(transaction, connection) //remember that this is the way to sign and send a txn using wallet( users) public key, without having the private key
        console.log(response)


    }


    return <div style={{

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "column"
    }}>

        <h1>Solana Token Launchpad</h1>
        <input onChange={handleChange} name="name" value={metaData.name} className='inputText' type='text' placeholder='Name'></input> <br />
        <input onChange={handleChange} name="symbol" value={metaData.symbol} className='inputText' type='text' placeholder='Symbol'></input> <br />
        <input onChange={handleChange} name="image_url" value={metaData.image_url} className='inputText' type='text' placeholder='Image URL'></input> <br />
        <input onChange={handleChange} name="initial_supply" value={metaData.initial_supply} className='inputText' type='text' placeholder='Initial Supply'></input> <br />
        <button onClick={createToken} className='btn'>Create a token</button>
    </div>
}