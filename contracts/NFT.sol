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
    Counters.Counter private _itemsSold;
    Counters.Counter private _totalIds; //total items created(inc, deleted one, but its in 0 address)


    address payable owner; //determine the owner of the contract
    uint256 listingPrice = 0 ether; //can be considered as MATIC


    constructor() ERC721("Metaverse Tokens", "METT") {
        owner = payable(msg.sender);
    }


    struct MarketItem {
      uint256 tokenId;
      address payable seller;
      address payable owner;
      uint256 price;
      bool sold;
      address[] warehouses;
      address payable nextWarehouse;
      bool completed; //to filter if the parcel has reached the recipient address
    }


    mapping(uint256 => MarketItem) private idToMarketItem;

    event MarketItemCreated (
      uint256 indexed tokenId,
      address seller,
      address owner,
      uint256 price,
      bool sold,
      address[] warehouses,
      address nextWarehouse,
      bool completed
    );


    /* Updates the listing price of the contract */
    function updateListingPrice(uint _listingPrice) public payable {
      require(owner == msg.sender, "Only marketplace owner can update listing price.");
      listingPrice = _listingPrice;
    }

    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
      return listingPrice;
    }

    /* Mints a token and lists it in the marketplace */
    function createToken(string memory tokenURI, uint256 price, address nextWarehouse) public payable returns (uint) {
      _tokenIds.increment();
      uint256 newTokenId = _tokenIds.current();

      _mint(msg.sender, newTokenId);
      _setTokenURI(newTokenId, tokenURI);
      createMarketItem(newTokenId, price, nextWarehouse);
      return newTokenId;
    }

    function createMarketItem(
      uint256 tokenId,
      uint256 price,
      address nextWarehouse
    ) private {
    
      //require(price > 0, "Price must be at least 1 wei");
      require(msg.value == listingPrice, "Price must be equal to listing price");
      _totalIds.increment();

      address[] memory owners = new address[](1);
      owners[0] = payable(msg.sender);
      idToMarketItem[tokenId] =  MarketItem(
        tokenId,
        payable(msg.sender),
        payable(address(this)),
        price,
        false,
        owners,
        payable(nextWarehouse),
        false
      );

      _transfer(msg.sender, address(this), tokenId);
      emit MarketItemCreated(
        tokenId,
        msg.sender,
        address(this),
        price,
        false,
        owners,
        nextWarehouse,
        false
      );
    }

    /* allows someone to resell a token they have purchased */
    function createRequest(uint256 tokenId, address nextWarehouse) public payable {
      require(idToMarketItem[tokenId].owner == msg.sender, "Only item owner can perform this operation");
      idToMarketItem[tokenId].sold = false;
      idToMarketItem[tokenId].seller = payable(msg.sender);
      idToMarketItem[tokenId].owner = payable(address(this));
      idToMarketItem[tokenId].nextWarehouse = payable(nextWarehouse);
      _itemsSold.decrement();

      _transfer(msg.sender, address(this), tokenId);

    }

    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function createMarketSale(
      uint256 tokenId
      ) public payable {
      uint price = idToMarketItem[tokenId].price;
      address seller = idToMarketItem[tokenId].seller;
      require(msg.value == price, "Please submit the asking price in order to complete the purchase");
      idToMarketItem[tokenId].owner = payable(msg.sender);
      idToMarketItem[tokenId].sold = true;
      idToMarketItem[tokenId].seller = payable(address(0));
      idToMarketItem[tokenId].warehouses.push(payable(msg.sender));
      idToMarketItem[tokenId].nextWarehouse = payable(address(0));
      
      _itemsSold.increment();
      _transfer(address(this), msg.sender, tokenId);
      payable(owner).transfer(listingPrice);
      payable(seller).transfer(msg.value);
    }

    /* Returns all unsold market items */
    function fetchMarketItems() public view returns (MarketItem[] memory){
        uint itemCount = _totalIds.current();
        uint unsoldItemCount = _tokenIds.current() - _itemsSold.current();
        uint currentIndex = 0;

        //link of unsold item count
        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        
        //loop over number of items that have been created
        for (uint i = 0; i < itemCount; i++){
            //check if the item is unsold by checking if the owner is empty address
            if (idToMarketItem[i+1].tokenId != 0 && idToMarketItem[i+1].sold == false){
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;

    }

    //To fetch the item requested to the caller
    function fetchRequested() public view returns (MarketItem[] memory){
        uint totalItemCount = _totalIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i< totalItemCount; i++){
           if (idToMarketItem[i+1].nextWarehouse == msg.sender) {
                itemCount += 1;
           } 
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++){
            if (idToMarketItem[i+1].nextWarehouse == msg.sender){
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        
        return items;
    }

    /* Returns only items that a user has purchased */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
      uint totalItemCount = _totalIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].owner == msg.sender) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].owner == msg.sender) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    //to fetch a specific index (for the detail page)
    function fetchNFT(uint256 index) public view returns (MarketItem[] memory) {
      uint totalItemCount = _totalIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].owner == msg.sender) {
          itemCount += 1;
        }
      }

      
      MarketItem[] memory items = new MarketItem[](1);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].owner == msg.sender && (i+1) == index) {
          uint currentId = i + 1;
          MarketItem memory currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
        }
      }
      return items;
    }

    //to fetch all nft created (burnt is not included as it is gone already)
    //Used in database.js
    function fetchAllNFT() public view returns (MarketItem[] memory) {
      uint totalItemCount = _totalIds.current();
      uint remItemCount = _tokenIds.current();
      uint currentIndex = 0;
      
      MarketItem[] memory items = new MarketItem[](remItemCount);
      for (uint i = 0; i< totalItemCount; i++) {
          if (idToMarketItem[i + 1].tokenId != 0) {
            uint currentId = i + 1;
            MarketItem storage currentItem = idToMarketItem[currentId];
            items[currentIndex] = currentItem;
            currentIndex += 1;
        }
      }
      return items;
    }

    function removeRequest(uint256 index) public payable{
        uint totalItemCount = _totalIds.current();

        for (uint i = 0; i< totalItemCount; i++){
           if (idToMarketItem[i+1].nextWarehouse == msg.sender && (i+1) == index ) {
                console.log(idToMarketItem[i+1].tokenId);
                idToMarketItem[i+1].nextWarehouse = payable(address(0));
                break;
           } 
        }
    }


    //when deployed using the test network, it works. but not sure what the error is yet when deploy to the website
    //this is to burn the token
    function burnToken(uint256 tokenId) public payable{
        
        //in built function from ERC721 to burn the token, can be seen in down below
        //https://docs.openzeppelin.com/contracts/2.x/api/token/erc721#ERC721
        uint totalItemCount = _tokenIds.current();
        //uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i< totalItemCount; i++){
            if (idToMarketItem[i+1].tokenId == tokenId && idToMarketItem[i+1].sold == true) {
                currentIndex = i+1;
            }
        }
        _burn(tokenId);
        delete idToMarketItem[currentIndex];
        _tokenIds.decrement();
        _itemsSold.decrement();

        
    }

}


//https://www.crowdbotics.com/blog/how-to-build-burnable-and-pausable-erc-721-tokens-using-openzeppelin-and-quiknode
//Can give permission to other account to burn the NFT


