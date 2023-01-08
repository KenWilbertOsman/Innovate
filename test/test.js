// const {
//   time,
//   loadFixture,
// } = require("@nomicfoundation/hardhat-network-helpers");
// const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarket", function(){
  it("Should create and execute market sales", async function(){
      const Market = await ethers.getContractFactory("NFTMarket")
      const market = await Market.deploy()     
      await market.deployed()
      const marketAddress = market.address

      const NFT = await ethers.getContractFactory("NFT")
      const nft = await NFT.deploy(marketAddress)
      await nft.deployed()
      const nftContractAddress = nft.address

      let listingPrice = await market.getListingPrice()
      listingPrice = listingPrice.toString()

      const auctionPrice = ethers.utils.parseUnits('100', 'ether')
      
      //Create two nfts
      //approve marketaddress already
      await nft.createToken("http") // number 1
      await nft.createToken("http") // number 2
      await nft.createToken("http") // number 3


      //ethers library to get multiple test accounts
      const [firstAddress, buyerAddress] = await ethers.getSigners()
      //console.log("first ", firstAddress.getAddress()); //0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
      //console.log("buyer ", buyerAddress.getAddress()); //0x70997970C51812dc3A010C7d01b50e0d17dc79C8

 
      //Place the nft to sale
      await market.createMarketItem(nftContractAddress, 1, auctionPrice, firstAddress.getAddress(), {value: listingPrice})
      await market.createMarketItem(nftContractAddress, 2, auctionPrice, buyerAddress.getAddress(), {value: listingPrice})
      await market.createMarketItem(nftContractAddress, 3, auctionPrice, '0x0000000000000000000000000000000000000000', {value: listingPrice})

      
      // let d = await market.connect(buyerAddress).fetchMarketItems()
      // console.log("Market items ", d)

      // let e = await market.connect(buyerAddress).fetchRequested()
      // console.log("Buyer request list ", e)

      await market.connect(buyerAddress).createMarketSale(nftContractAddress, 2, {value: auctionPrice})
      
      
      let a = await market.connect(buyerAddress).fetchMyNFTs()
      console.log("My NFT ", a)  
      
      e = await market.connect(buyerAddress).fetchRequested()
      console.log("Buyer request list now ", e)

      //await nft.approve(buyerAddress.getAddress(), 2);


      await market.connect(buyerAddress).createRequest(nftContractAddress, 2, firstAddress.getAddress(), {value: auctionPrice})
      
      e = await market.connect(firstAddress).fetchRequested()
      console.log("first request list now ", e)

      
      await market.connect(buyerAddress).createMarketSale(nftContractAddress, 3, {value: auctionPrice})

  });
});


describe("NFTToken", function(){
  it("Should create NFT token", async function(){

  });
});



// This is the sample given default

// describe("NFTMarket", function () {
//   // We define a fixture to reuse the same setup in every test.
//   // We use loadFixture to run this setup once, snapshot that state,
//   // and reset Hardhat Network to that snapshot in every test.
//   async function deployOneYearLockFixture() {
//     const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
//     const ONE_GWEI = 1_000_000_000;

//     const lockedAmount = ONE_GWEI;
//     const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

//     // Contracts are deployed using the first signer/account by default
//     const [owner, otherAccount] = await ethers.getSigners();

//     const Lock = await ethers.getContractFactory("Lock");
//     const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

//     return { lock, unlockTime, lockedAmount, owner, otherAccount };
//   }

//   describe("Deployment", function () {
//     it("Should set the right unlockTime", async function () {
//       const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);

//       expect(await lock.unlockTime()).to.equal(unlockTime);
//     });

//     it("Should set the right owner", async function () {
//       const { lock, owner } = await loadFixture(deployOneYearLockFixture);

//       expect(await lock.owner()).to.equal(owner.address);
//     });

//     it("Should receive and store the funds to lock", async function () {
//       const { lock, lockedAmount } = await loadFixture(
//         deployOneYearLockFixture
//       );

//       expect(await ethers.provider.getBalance(lock.address)).to.equal(
//         lockedAmount
//       );
//     });

//     it("Should fail if the unlockTime is not in the future", async function () {
//       // We don't use the fixture here because we want a different deployment
//       const latestTime = await time.latest();
//       const Lock = await ethers.getContractFactory("Lock");
//       await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
//         "Unlock time should be in the future"
//       );
//     });
//   });

//   describe("Withdrawals", function () {
//     describe("Validations", function () {
//       it("Should revert with the right error if called too soon", async function () {
//         const { lock } = await loadFixture(deployOneYearLockFixture);

//         await expect(lock.withdraw()).to.be.revertedWith(
//           "You can't withdraw yet"
//         );
//       });

//       it("Should revert with the right error if called from another account", async function () {
//         const { lock, unlockTime, otherAccount } = await loadFixture(
//           deployOneYearLockFixture
//         );

//         // We can increase the time in Hardhat Network
//         await time.increaseTo(unlockTime);

//         // We use lock.connect() to send a transaction from another account
//         await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
//           "You aren't the owner"
//         );
//       });

//       it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
//         const { lock, unlockTime } = await loadFixture(
//           deployOneYearLockFixture
//         );

//         // Transactions are sent using the first signer by default
//         await time.increaseTo(unlockTime);

//         await expect(lock.withdraw()).not.to.be.reverted;
//       });
//     });

//     describe("Events", function () {
//       it("Should emit an event on withdrawals", async function () {
//         const { lock, unlockTime, lockedAmount } = await loadFixture(
//           deployOneYearLockFixture
//         );

//         await time.increaseTo(unlockTime);

//         await expect(lock.withdraw())
//           .to.emit(lock, "Withdrawal")
//           .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
//       });
//     });

//     describe("Transfers", function () {
//       it("Should transfer the funds to the owner", async function () {
//         const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
//           deployOneYearLockFixture
//         );

//         await time.increaseTo(unlockTime);

//         await expect(lock.withdraw()).to.changeEtherBalances(
//           [owner, lock],
//           [lockedAmount, -lockedAmount]
//         );
//       });
//     });
//   });
// });
