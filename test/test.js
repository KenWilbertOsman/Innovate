// const {
//   time,
//   loadFixture,
// } = require("@nomicfoundation/hardhat-network-helpers");
// const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarket", function() {
  it("Should create and execute market sales", async function() {
    /* deploy the marketplace */
    const NFTMarketplace = await ethers.getContractFactory("NFT")
    const nftMarketplace = await NFTMarketplace.deploy()
    await nftMarketplace.deployed()

    let listingPrice = await nftMarketplace.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('1', 'ether')
    
    const [firstAddress, buyerAddress] = await ethers.getSigners()
    /* create two tokens */
    await nftMarketplace.createToken("https://www.mytokenlocation.com", auctionPrice, buyerAddress.getAddress(), { value: listingPrice })
    await nftMarketplace.createToken("https://www.mytokenlocation2.com", auctionPrice, buyerAddress.getAddress(), { value: listingPrice })

    /* execute sale of token to another user */

    console.log(await nftMarketplace.connect(buyerAddress).fetchRequested())
    await nftMarketplace.connect(buyerAddress).createMarketSale(1, { value: auctionPrice })
    await nftMarketplace.connect(buyerAddress).createMarketSale(2, { value: auctionPrice })

    console.log("my nft" , await nftMarketplace.connect(buyerAddress).fetchMyNFTs())

    const data = await nftMarketplace.connect(buyerAddress).fetchNFT(1)
    console.log("1 is", data)
    await nftMarketplace.connect(buyerAddress).burnToken(2, { value: auctionPrice })

    /* resell a token */
    
    //console.log(await nftMarketplace.connect(buyerAddress).fetchMyNFTs())

    await nftMarketplace.connect(buyerAddress).createRequest(1,  firstAddress.getAddress(), { value: listingPrice })

    
    //console.log("my nft now ",await nftMarketplace.connect(buyerAddress).fetchMyNFTs())
    //console.log("first request ", await nftMarketplace.connect(firstAddress).fetchRequested())

    await nftMarketplace.connect(firstAddress).createMarketSale(1, { value: auctionPrice })
    //console.log("my first nft now ",await nftMarketplace.connect(firstAddress).fetchMyNFTs())
    //console.log("first request now", await nftMarketplace.connect(firstAddress).fetchRequested())

    /* query for and return the unsold items */
    items = await nftMarketplace.fetchMarketItems()
    items = await Promise.all(items.map(async i => {
      const tokenUri = await nftMarketplace.tokenURI(i.tokenId)
      let item = {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri
      }
      return item
    }))
    //console.log('items: ', items)
  })
})
// describe("NFTMarket", function(){
//   it("Should create and execute market sales", async function(){
//       const Market = await ethers.getContractFactory("NFTMarket")
//       const market = await Market.deploy()     
//       await market.deployed()
//       const marketAddress = market.address

//       const NFT = await ethers.getContractFactory("NFT")
//       const nft = await NFT.deploy(marketAddress)
//       await nft.deployed()
//       const nftContractAddress = nft.address

//       let listingPrice = await market.getListingPrice()
//       listingPrice = listingPrice.toString()

//       const auctionPrice = ethers.utils.parseUnits('100', 'ether')
      
//       //Create two nfts
//       //approve marketaddress already
//       await nft.createToken("http") // number 1
//       await nft.createToken("http") // number 2
//       await nft.createToken("http") // number 3


//       //ethers library to get multiple test accounts
//       const [firstAddress, buyerAddress] = await ethers.getSigners()
//       //console.log("first ", firstAddress.getAddress()); //0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
//       //console.log("buyer ", buyerAddress.getAddress()); //0x70997970C51812dc3A010C7d01b50e0d17dc79C8

 
//       //Place the nft to sale
//       await market.createMarketItem(nftContractAddress, 1, auctionPrice, firstAddress.getAddress(), {value: listingPrice})
//       await market.createMarketItem(nftContractAddress, 2, auctionPrice, buyerAddress.getAddress(), {value: listingPrice})
//       await market.createMarketItem(nftContractAddress, 3, auctionPrice, '0x0000000000000000000000000000000000000000', {value: listingPrice})

      
//       // let d = await market.connect(buyerAddress).fetchMarketItems()
//       // console.log("Market items ", d)

//       // let e = await market.connect(buyerAddress).fetchRequested()
//       // console.log("Buyer request list ", e)

//       await market.connect(buyerAddress).createMarketSale(nftContractAddress, 2, {value: auctionPrice})
      
      
//       let a = await market.connect(buyerAddress).fetchMyNFTs()
//       console.log("My NFT ", a)  
      
//       e = await market.connect(buyerAddress).fetchRequested()
//       console.log("Buyer request list now ", e)

//       //await nft.approve(buyerAddress.getAddress(), 2);


//       await market.connect(buyerAddress).createRequest(nftContractAddress, 2, firstAddress.getAddress(), {value: auctionPrice})
      
//       e = await market.connect(firstAddress).fetchRequested()
//       console.log("first request list now ", e)

      
//       await market.connect(buyerAddress).createMarketSale(nftContractAddress, 3, {value: auctionPrice})

//   });
// });

