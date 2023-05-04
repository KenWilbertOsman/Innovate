//require("@nomicfoundation/hardhat-toolbox");  
require("@nomiclabs/hardhat-waffle")

//API Key from Alchemy for polyon mumbai testnet
const projectIdMumbai = process.env.MUMBAI;


////API Key from Alchemy for polyon mainnet
const projectIdMain = process.env.MAIN;

/** 
const fs= require ("fs")
const privateKey = fs.readFileSync(".secret").toString()
*/

const privateKey = process.env.MUMBAI_KEY
//MUMBAI TESTNET https://www.alchemy.com/overviews/mumbai-testnet
//MATIC MAINNET



/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat : {
      chainId: 1337
    },
    mumbai: {
      url:`https://polygon-mumbai.g.alchemy.com/v2/${projectIdMumbai}`,
      accounts: [privateKey]
    },
    mainnet: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${projectIdMain}`,
      accounts: [privateKey]
    }
  },
  solidity: "0.8.17",
};
