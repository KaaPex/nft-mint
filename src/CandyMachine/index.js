import React, {useState, useEffect} from 'react';

import { Connection } from '@solana/web3.js';

import {getCandyMachineState, mintOneToken} from './candy-machine';

import './CandyMachine.css';

const CandyMachine = ({walletAddress}) => {

  const [state, setState] = useState(null);

  useEffect(async () => {
    const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST;
    const connection = new Connection(rpcHost);

    const state = await getCandyMachineState(walletAddress, process.env.REACT_APP_CANDY_MACHINE_ID, connection);
    setState(state);
  }, []);

  const mintToken = async () => {
    debugger;
    let mintResult = await mintOneToken(state, walletAddress.publicKey);
    console.log(mintResult);
  }

  return (
    <div className="machine-container">
      <p>Drop Date:</p>
      <p>Items Minted:</p>
      <button className="cta-button mint-button" onClick={mintToken}>
        Mint NFT
      </button>
    </div>
  );
};

export default CandyMachine;
