//require("@nomicfoundation/hardhat-toolbox");  
require("@nomiclabs/hardhat-waffle")

//API Key from Alchemy for polyon mumbai testnet
const projectIdMumbai = "XLilwBjmXB4Un7jLMadilEQrwacQPZQp";


////API Key from Alchemy for polyon mainnet
const projectIdMain = "gbPBlXfmcdr7pNpIzb-TGPUfNO285IO4";

/** 
const fs= require ("fs")
const privateKey = fs.readFileSync(".secret").toString()
*/

const privateKey = "aedff1ccd946d06eba21c7828ac05a729cfe43228d6f6beb9694ff1f4ef99ecc";

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
