//- index.js => the "marketplace"
//Home Page


//CAN ADD IN THE DETAIL SUCH AS "BEING REQUESTED TO ..... WAREHOUSE OR OWNER"


//import styles from '../styles/Home.module.css'
import {ethers} from 'ethers'
import {useEffect, useState} from 'react' //to keep with local state
import axios from 'axios' //data fetching library
import Web3Modal from "web3modal"  //to connect to someone's ethereum wallet
import WarehouseNavbar from "../components/WarehouseNavbar"  

import {
  nftaddress, nftmarketaddress
} from '../config'


//import the artifacts from hardhat after it is compiled from 'npx hardhat ...'
//import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFT.sol/NFT.json'


//default function for this file
export default function Home() {
  const [nfts, setNfts] = useState([]) //empty array of nfts and setNfts to reset the nft array
  const [loadingState, setLoadingState] = useState('loaded') 

  // //call the function once when the page is loaded
  // useEffect(()=> {
  //  loadNFTs() 
  // }, [])

  // //load the nft into page 
  // async function loadNFTs() {
  //   const provider = new ethers.providers.JsonRpcProvider()
  //   const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    
  //   const data = await marketContract.fetchMarketItems()

  //   // to map all the items
  //   const items = await Promise.all(data.map(async i => {
  //     const tokenUri = await marketContract.tokenURI(i.tokenId)  
  //     //the metadata of the token where information are stored, cacn be used to IPFS
  //     const meta = await axios.get(tokenUri)
  //     let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
  //     let item = {
  //       price, 
  //       tokenId: i.tokenId.toNumber(),
  //       seller: i.seller,
  //       owner: i.owner,
  //       image: meta.data.image,
  //       name: meta.data.username,
  //       address: meta.data.useraddress,
  //       fragile: meta.data.fragile,
  //       date: meta.data.date
  //     }
  //     return item
  //   }))

  //   setNfts(items)
  //   setLoadingState('loaded')    
  // }

  // //logic of buying the nft
  // async function buyNft(nft) {
  //   const web3modal = new Web3Modal()
  //   const connection = await web3modal.connect()
  //   const provider = new ethers.providers.Web3Provider(connection)

  //   const signer = provider.getSigner()
  //   const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    
  //   const prices = ethers.utils.parseUnits(nft.price.toString(), 'ether')
  //   const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
  //     value: prices
  //   })
    

  //   await transaction.wait()
  //   loadNFTs()
  // }

  if (loadingState === 'loaded' && !nfts.length) return (
    <div className='font-serif'> 
    <WarehouseNavbar/>
    <h1 className = " px-20 py-10 text-4xl"> Home Page Design goes here</h1>
    </div>
  )
  return (
    <div className= "flex justify-center">
       <div className = "px-4" style= {{ maxWidth: '1600px'}}>
        <div className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4"> {/**Large screen give 4 column, small 2 column, then 1 column */}
            {
              nfts.map((nft, i) => (
                <div key = {i} className = "border shadow rounded-xl overflow-hidden">
                    <img src = {nft.image} />
                    <div className = "p-1">
                      <p style = {{height : '32px'}} className = "text-2xl font-semibold">{nft.name}</p>
                      <p style = {{height : '32px'}} className = "text-xl font-semibold">{nft.address}</p>
                      <p style = {{height : '32px'}} className = "text-xl font-semibold">{nft.fragile}</p>
                      
                </div>
                {/* <div className = "p-4 pg-black">
                  <button className= "w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>Buy</button>
                </div> */}
                </div>
              ))
            }
        </div>
       </div>
    </div>
  )
}
