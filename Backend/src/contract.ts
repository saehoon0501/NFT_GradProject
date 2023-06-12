// import Web3 from "web3";
// import config from "./config";

// const web3 = new Web3(`ws://127.0.0.1:8545`);
// const myContract = new web3.eth.Contract(config.abi, config.contractAddress);

// let options = {
//   filter: {
//     value: [],
//   },
//   fromBlock: "latest",
// };

// myContract.events.Minted(options).on("data", (event) => {
//   console.log(event.returnValues.to);

//   User.findOne({ publicAddr: event.returnValues.to.toLowerCase() }).then(
//     (user) => {
//       if (user) {
//         user.ownerOfNFT[0].NFT_URL.push(event.returnValues.tokenURI);
//         console.log(user.ownerOfNFT[0].NFT_URL);
//         user.save();
//       } else {
//         const user1 = new User({
//           publicAddr: event.returnValues.to.toLowerCase(),
//           ownerOfNFT: [
//             {
//               collection_id: "NCC 1st",
//               NFT_URL: [event.returnValues.tokenURI],
//             },
//           ],
//           role: "user",
//           profile: {
//             username: "안녕하세요",
//             caption: "",
//             points: 0,
//             post_ids: [],
//             profile_pic: event.returnValues.tokenURI,
//           },
//         });
//         console.log(user1);
//         user1.save();
//       }
//     }
//   );
// });
