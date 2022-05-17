import React, {useState, useEffect} from 'react';

import {Metadata} from "@metaplex-foundation/mpl-token-metadata";

import {Connection} from '@solana/web3.js';

import {getCandyMachineState, mintOneToken} from './candy-machine';

import CountdownTimer from '../CountdownTimer';

import './CandyMachine.css';

const CandyMachine = ({walletAddress}) => {

  const [candyMachine, setCandyMachine] = useState(null);
  const [metadata, setMetadata] = useState([]);
  const [isLoadingMints, setIsLoadingMints] = useState(true);

  useEffect(() => {
    const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST;
    const connection = new Connection(rpcHost);

    const getState = async () => {
      const newState = await getCandyMachineState(walletAddress, process.env.REACT_APP_CANDY_MACHINE_ID, connection);
      setCandyMachine(newState);

      const nftsMetadata = await Metadata.findDataByOwner(connection, walletAddress.publicKey);
      if (nftsMetadata.length) {
        nftsMetadata.forEach(async mint => {
          const item = await fetch(mint.data.uri).then(result => result.json());
          setMetadata([...metadata, item]);
        })
      }
      setIsLoadingMints(false);
    };

    getState();
  }, []);

  const mintToken = () => {
    const mintResult = async () => {
      const mint = await mintOneToken(candyMachine, walletAddress.publicKey);
    };

    mintResult();
  }

  const liveDateString = goLiveDate => `${new Date(
    goLiveDate * 1000
  ).toGMTString()}`;

  const renderDropTimer = () => {
    // Get the current date and dropDate in a JavaScript Date object
    const currentDate = new Date();
    const dropDate = new Date(candyMachine.state.goLiveDate * 1000);

    // If currentDate is before dropDate, render our Countdown component
    if (currentDate < dropDate) {
      console.log('Before drop date!');
      // Don't forget to pass over your dropDate!
      return <CountdownTimer dropDate={dropDate}/>;
    }

    // Else let's just return the current drop date
    return <p>{`Drop Date: ${liveDateString(candyMachine.state.goLiveDate.toNumber())}`}</p>;
  };

  const renderMintedItems = () => (
    <div className="gif-container">
      <div className="gif-grid">
        {metadata.map((item, idx) => (
          <div className="gif-item" key={idx}>
            <img src={item.image} alt={item.name} />
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="machine-container">
      {candyMachine?.state && <>
        <p>{`Drop Date: ${liveDateString(candyMachine.state.goLiveDate.toNumber())}`}</p>

        <p>{`Items Minted: ${candyMachine.state.itemsRedeemed} / ${candyMachine.state.itemsAvailable}`}</p>
      </>}

      {candyMachine?.state?.itemsRedeemed === candyMachine?.state?.itemsAvailable ? (
        <p className="sub-text">Sold Out 🙊</p>
      ) : (
        <button className="cta-button mint-button" onClick={mintToken}>
          Mint NFT
        </button>
      )}

      {metadata.length > 0 && renderMintedItems()}
      {isLoadingMints && <p>LOADING MINTS...</p>}
    </div>
  );
};

export default CandyMachine;
