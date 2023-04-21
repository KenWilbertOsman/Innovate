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
    //buyer address = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
    //first address = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

    /* create two tokens */
    await nftMarketplace.createToken("https://www.mytokenlocation.com", auctionPrice, buyerAddress.getAddress(), { value: listingPrice })
    await nftMarketplace.createToken("https://www.mytokenlocation2.com", auctionPrice, buyerAddress.getAddress(), { value: listingPrice })

    await nftMarketplace.connect(buyerAddress).createMarketSale(1, {value:listingPrice})
    // await nftMarketplace.connect(buyerAddress).removeRequest(1)
    console.log(await nftMarketplace.connect(buyerAddress).fetchMyNFTs())
    await nftMarketplace.connect(buyerAddress).createRequest(1, firstAddress.address)

    
    console.log('second', await nftMarketplace.connect(buyerAddress).fetchMyNFTs())

    await nftMarketplace.connect(firstAddress).removeRequest(1)
    
    console.log('third', await nftMarketplace.connect(buyerAddress).fetchMyNFTs())


    await nftMarketplace.connect(buyerAddress).burnToken(1)
    
    console.log('fourth', await nftMarketplace.connect(firstAddress).fetchAllNFT())
        
    
  })})
