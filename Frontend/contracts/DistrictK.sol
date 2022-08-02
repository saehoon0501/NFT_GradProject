// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract DistrictK is Ownable, ERC721{
  uint256 public mintPrice = 0.05 ether;
  uint256 public totalSupply = 0;
  uint256 public maxSupply;
  mapping(address=>uint256) public mintedWallets;

  struct FT{
    string name;
    uint256 id;
    uint8 rarity;
  }

  FT[] public fts;

  constructor() payable ERC721('DistrictK', 'DK'){
      maxSupply = 2;
  }

  function _createft(string memory _name, uint256 id) internal{
    FT memory newFt = FT(_name,totalSupply,0);
    fts.push(newFt);
    totalSupply++;
    _safeMint(msg.sender, totalSupply);
  }

  function setMaxSupply (uint256 maxSupply_) external onlyOwner {
    maxSupply = maxSupply;
  }

  function mint() external payable{
    // require(mintedWallets[msg.sender]<2,"exceeds max per wallet");
    // require(msg.value == mintPrice, "wrong value");
    // require(maxSupply > totalSupply, "sold out");

    mintedWallets[msg.sender]++;
    totalSupply++;
    uint256 tokenId = totalSupply;
    _safeMint(msg.sender, tokenId);
  }
  
}