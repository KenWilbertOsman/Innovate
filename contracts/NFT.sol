// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


//for console.log
import "hardhat/console.sol";



contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter; //use to declare variable tokenIds
    Counters.Counter private _tokenIds; //allow us to keep up wiht incrementing value for a unique ientifier for each toke
    address contractAddress; //address of the marketplace for the NFT to interact


    //constructor
    constructor(address marketplaceAddress) ERC721("Metaverse Tokens", "METT") {
        contractAddress = marketplaceAddress;
    }

    //for minting tokens
    function createToken(string memory tokenURI) public returns (uint){
        _tokenIds.increment();
        //get the current value of the token ids
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true); //give the token approval to transact in the marketplace
        return newItemId;
    }   

    //when deployed using the test network, it works. but not sure what the error is yet when deploy to the website
    //this is to burn the token
    function burnToken(uint256 tokenId) public{

        //in built function from ERC721 to burn the token, can be seen in down below
        //https://docs.openzeppelin.com/contracts/2.x/api/token/erc721#ERC721
        _burn(tokenId);
        //just decrement the counter for the NFT counts
        _tokenIds.decrement();
        
    }


}


//https://www.crowdbotics.com/blog/how-to-build-burnable-and-pausable-erc-721-tokens-using-openzeppelin-and-quiknode
//Can give permission to other account to burn the NFT


