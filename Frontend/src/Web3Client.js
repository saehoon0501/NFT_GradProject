import axios from "axios";
import Web3 from "web3/dist/web3.min.js";
import DistrictK from "./contracts/DistrictK.json";
import {useNavigate} from 'react-router-dom'
import {useEffect} from 'react';

export let selectedAccount; 

let dk;

let isInitialized = false;

const baseURL = "http://localhost:4000";

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

export const Login = (props) => {

    const web3 = new Web3(window.ethereum);
    const navigate = useNavigate();

    useEffect(()=>{
        props.setIsAuth(true);
    })

    const handleSignMessage = async (publicAddress, nonce) => {
       try{
            const msg = `I am signing my one-time Nonce: ${nonce}`;
           const signature = await web3.eth.personal.sign(msg,publicAddress);
           return {publicAddress, signature, msg};
       }catch(err){
            console.log(err);   
       }
    };

    const handleAuthenticate = async ({publicAddress, signature, msg}) =>{
    try{
        const result = await axios.post(`${baseURL}/api/auth`, {publicAddress: `${publicAddress}`, signature:`${signature}`, msg:`${msg}`})
        .then(res=>{return res.data});

        console.log(JSON.stringify(result));

       if(result != null){
        localStorage.setItem("NFTLogin", result.accessToken);
        props.setIsAuth(true);
        navigate('/home'); 
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

        axios.get(`${baseURL}/api/auth`)
        .then((res)=>{
            const nonce = res.data;
            handleSignMessage(selectedAccount,nonce)
            .then(({publicAddress, signature,msg}) => {handleAuthenticate({publicAddress, signature, msg})});
        }, error => {
            console.log(error);
        })
        
    };

    return(
        <div>
            <button className="login__button" onClick={handleClick} link>
                Login to SNS
            </button>
        </div>
    );
};