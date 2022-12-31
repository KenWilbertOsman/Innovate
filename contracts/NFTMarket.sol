// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol"; //security mechanism, protect certain transactions 

contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;    
    Counters.Counter private _itemIds; //remaining items
    Counters.Counter private _itemsSold;

    Counters.Counter private _totalIds; //total items created(inc, deleted one, but its in 0 address)

    address payable owner; //determine the owner of the contract
    uint256 listingPrice = 0.00000001 ether; //can be considered as MATIC


    constructor() {
        owner = payable(msg.sender);
    }

    //struct files to store the information needed
    struct MarketItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;

    }

    //to keep up with all the items created
    //passing in integer uint256, returns MarketItem
    mapping(uint256 => MarketItem) private idToMarketItem;

    event MarketItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );


    //to list the price of the items
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function getItemId() public view returns(uint256) {
        uint256 a = _itemIds.current();
        return a;
    }
    
    function getItemSold() public view returns(uint256) {
        uint256 a = _itemsSold.current();
        return a;
    }
    
    function getIdToMarketItem() public view returns(MarketItem[] memory){
        uint256 itemCount = _totalIds.current();
        uint256 currentIndex = 0;
        MarketItem[] memory items = new MarketItem[](itemCount);

        for (uint i = 0; i < itemCount; i++){
            //check if the item is unsold by checking if the owner is empty address
            uint currentId = idToMarketItem[i+1].itemId;
            MarketItem storage currentItem = idToMarketItem[currentId];
            items[currentIndex] = currentItem;
            currentIndex += 1;
            
        }
        return items;
    }

    //to put the item for sale
    function createMarketItem(
        address nftContract, //contract address
        uint256 tokenId, //id for the token from the contract
        uint256 price //the sale price of the token
    ) public payable nonReentrant{ 
        //Condition that the price to be > 0, or not free
        require(price > 0, "Price must be at least 1 wei");
    
        //Condition that user is passing in the required listing price
        require(msg.value == listingPrice, "Price must be equal to listing price");

        _itemIds.increment();

        _totalIds.increment();

        uint256 itemId = _itemIds.current();

        idToMarketItem[itemId] = MarketItem(
            itemId, 
            nftContract,
            tokenId,
            payable(msg.sender), //person that is selling it
            payable(address(0)), //owner is set to empty address as it is currently being put on sale which means no owner currently
            price,
            false
        );

        //Transfer ownership of the nft to the contract which the contract take the ownership and can be transferred to the buyer
        //@param nftContract
        //@see can be found in openzeppelin
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        
        //emit the event 
        emit MarketItemCreated(
            itemId, 
            nftContract,
            tokenId,
            msg.sender, //person that is selling it
            address(0), //owner is set to empty address as it is currently being put on sale which means no owner currently
            price,
            false 
        );
    }

    //to buy or sell the items between parties
    //Price is not passed as it is noted down in the contract
    function createMarketSale(
        address nftContract,
        uint256 itemId
        ) public payable nonReentrant{
            uint price = idToMarketItem[itemId].price;
            uint tokenId = idToMarketItem[itemId].tokenId;

            //person setting this transaction to set the correct price value
            require(msg.value == price, "Please submit the asking price in order to complete the purchase");
            
            //transfer the value of the transaction to the seller
            idToMarketItem[itemId].seller.transfer(msg.value);

            //transfer the ownership 
            IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

            idToMarketItem[itemId].owner = payable(msg.sender);
            idToMarketItem[itemId].sold = true;
            _itemsSold.increment();

            //transfer the money to the contract owner
            payable(owner).transfer(listingPrice);
        }


    //to fetch the unsold items in the market, or currently on sale
    function fetchMarketItems() public view returns (MarketItem[] memory){
        uint itemCount = _totalIds.current();
        uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
        uint currentIndex = 0;

        //link of unsold item count
        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        
        //loop over number of items that have been created
        for (uint i = 0; i < itemCount; i++){
            //check if the item is unsold by checking if the owner is empty address
            if (idToMarketItem[i+1].itemId != 0 && idToMarketItem[i+1].sold == false){
                uint currentId = idToMarketItem[i+1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;

    }

    //to return the NFTs that the user purchased
    function fetchMyNFTs() public view returns (MarketItem[] memory){
        uint totalItemCount = _totalIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i< totalItemCount; i++){
           if (idToMarketItem[i+1].owner == msg.sender) {
                itemCount += 1;
           } 
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++){
            if (idToMarketItem[i+1].owner == msg.sender){
                uint currentId = idToMarketItem[i+1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        
        return items;

    }

    function burnNFT(uint256 tokenId) public{


        //in built function from ERC721 to burn the token, can be seen in down below
        //https://docs.openzeppelin.com/contracts/2.x/api/token/erc721#ERC721
        uint totalItemCount = _itemIds.current();
        //uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i< totalItemCount; i++){
            if (idToMarketItem[i+1].tokenId == tokenId && idToMarketItem[i+1].sold == true) {
                currentIndex = i+1;
            }
        }

        delete idToMarketItem[currentIndex];
        _itemIds.decrement();
        _itemsSold.decrement();
    }


    //to fetch the NFTs that the user has created themselves
    function fetchItemsCreated() public view returns (MarketItem[] memory) {
        uint totalItemCount = _totalIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++){
             if (idToMarketItem[i+1].seller == msg.sender){
                itemCount += 1;
             }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);

        for (uint i = 0; i< totalItemCount; i++){
            if (idToMarketItem[i+1].seller == msg.sender){
                uint currentId = idToMarketItem[i+1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}

