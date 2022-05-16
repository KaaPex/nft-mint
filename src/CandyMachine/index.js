import React, {useState, useEffect} from 'react';

import { Connection } from '@solana/web3.js';

import {getCandyMachineState, mintOneToken} from './candy-machine';

import './CandyMachine.css';

const CandyMachine = ({walletAddress}) => {

  const [candyMachine, setCandyMachine] = useState(null);

  useEffect( () => {
    const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST;
    const connection = new Connection(rpcHost);

    const getState = async () => {
      const newState = await getCandyMachineState(walletAddress, process.env.REACT_APP_CANDY_MACHINE_ID, connection);
      setCandyMachine(newState);
    };

    getState();
  }, []);

  const mintToken =  () => {
    const mintResult = async () => {
      const mint = await mintOneToken(candyMachine, walletAddress.publicKey);
    };

    mintResult();
  }

  const liveDateString = goLiveDate => `${new Date(
      goLiveDate * 1000
    ).toGMTString()}`;

  return (
    <div className="machine-container">
      <p>{`Drop Date: ${liveDateString(candyMachine.state.goLiveDate.toNumber())}`}</p>

      <p>{`Items Minted: ${candyMachine.state.itemsRedeemed} / ${candyMachine.state.itemsAvailable}`}</p>

      <button className="cta-button mint-button" onClick={mintToken}>
        Mint NFT
      </button>
    </div>
  );
};

export default CandyMachine;
