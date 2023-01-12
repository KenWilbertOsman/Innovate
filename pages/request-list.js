
import {ethers} from 'ethers'
// for useState and useEffect, see this https://medium.com/recraftrelic/usestate-and-useeffect-explained-cdb5dc252baf
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import {useRouter} from 'next/router'


import {
    nftmarketaddress, nftaddress
} from '../config'

//import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFT.sol/NFT.json'

export default function RequestList() {
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    const router = useRouter()
    useEffect (() => {
        loadNFTs()
    }, [])


    async function loadNFTs() {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        

        const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        // const tokenContract = new ethers.Contract(nftaddress, NFT.abi, signer)
        
        const data = await marketContract.fetchRequested()
        // const data = await marketContract.fetchRequested()

        const items = await Promise.all(data.map(async i => {
            const tokenUri = await marketContract.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.data.image,
                name: meta.data.username,
                address: meta.data.useraddress,
                fragile: meta.data.fragile,
                owners: i.warehouses
            }
            return item
        }))
        console.log(items)
        setNfts(items)
        setLoadingState('loaded')


    }

    async function acceptRequestedNft(nft) {
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
    
        const signer = provider.getSigner()
        const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        
        const prices = ethers.utils.parseUnits(nft.price.toString(), 'ether')
        const transaction = await contract.createMarketSale(nft.tokenId, {
          value: prices
        })
    
        await transaction.wait()
        loadNFTs()
    }


    //SOON
    async function declineRequestedNft(nft){
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
    
        const signer = provider.getSigner()
        const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        
        const prices = ethers.utils.parseUnits(nft.price.toString(), 'ether')
        await contract.removeRequest(nft.tokenId, {
          value: prices
        })

        loadNFTs()
    }

    if (loadingState === 'loaded' && !nfts.length) return (
        <h1 className="py-10 px-20 text-3xl">No NFT requested to you</h1>
    )
    return (
        <div className= "flex justify-center">
            <div className = "p-4">
                <div className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                    {
                        nfts.map((nft,i) => (
                            <div key = {i} className = "border shadow rounded-xl overflow-hidden">
                                <img src = {nft.image} className = "rounded"/>
                                <div className = "p-4 bg-black">
                                    <p className = "text-xs font-bold text-white">Seller: {nft.seller}</p>
                                    <p className = "text-xs font-bold text-white">Owners:</p>
                                    {
                                        nft.owners.map((owner, j) => (
                                                (<p key = {j} className = "text-xs font-bold text-white">- {owner}</p>)
                                        )
                                        )
                                    }
                                    
                                </div>

                                <div className = "p-4 pg-black flex justify-center space-x-7">    
                                <button className= "w-half bg-green-500 text-white font-bold py-2 px-12 rounded" onClick={() => acceptRequestedNft(nft)}>Accept</button>
                                <button className= "w-half bg-red-500 text-white font-bold py-2 px-12 rounded" onClick={() => {declineRequestedNft(nft)}}>Delete</button>
                                </div>
                             </div>
                            
                        )
                        )
                    }

                </div>
            </div>
        </div>
    )
}