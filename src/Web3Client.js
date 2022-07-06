import Web3 from "web3/dist/web3.min.js";
import DistrictK from "./contracts/DistrictK.json";
import React, { useState } from 'react';


export let selectedAccount; 

let dk;

let isInitialized = false;

export const init = async () => {
    let provider = window.ethereum;

        if(typeof provider !== 'undefined'){
          //MetaMask is installed
          provider.request({method: "eth_requestAccounts"}).then(accounts=>{
            selectedAccount = accounts[0];
          })
          .catch((err)=>{
            console.log(err);
            return;
          });
        }

        const web3 = new Web3(provider);

        window.ethereum.on("accountsChanged", function (accounts){
          selectedAccount = accounts[0];
          console.log(accounts);
        });

        const network_id = await web3.eth.net.getId();
        const address = '0x1842a13a1c8d389834107ba166c6b78ce70f271a';

        dk = new web3.eth.Contract(DistrictK.abi, address);

        isInitialized = true;
        return selectedAccount;
};

export const mintToken = async () => {
    if(!isInitialized){
        await init(); 
    }
  return dk.methods.mint().send({from: selectedAccount});
}

export const Login = () => {

    const web3 = new Web3(window.ethereum);

    const handleSignMessage = async (publicAddress, nonce) => {
       try{
           const signature = await web3.eth.personal.sign('I am signing my one-time Nonce: ${nonce}',
           publicAddress,
           ''
           );
           return {publicAddress, signature};
       }catch(err){
            console.log(err);   
       }
    };

    const handleAuthenticate = async ({publicAddress, signature}) =>{
    try{
        const msg = await dk.methods.ownerOf(1).call();
       console.log(msg);
       if(publicAddress.toString().toLowerCase() === msg.toString().toLowerCase()){
        window.location.assign("http://localhost:3000/sns");            
        }else{
        window.alert("Login Failed Try Again");
        }
    }catch(err){
        window.alert("Login Failed Try Again");
    }
        
    }

    const handleClick = () => {
        if(!window.ethereum){
            window.alert("Please install MetaMask first");
            return;
        }
        try{
            handleSignMessage(selectedAccount,'124315')
        .then(handleAuthenticate);

        }catch(err){
            console.log(err);
        }
        
    };

    return(
        <div>
            <button className="login__button" onClick={handleClick} link>
                Login to SNS
            </button>
        </div>
    );
};