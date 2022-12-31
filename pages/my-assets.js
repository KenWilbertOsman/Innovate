//- my-assets.js => your own assets if its not put on sale
//"My Digital Assets" Page



import {ethers} from 'ethers'
// for useState and useEffect, see this https://medium.com/recraftrelic/usestate-and-useeffect-explained-cdb5dc252baf
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import {useRouter} from 'next/router'


import {
    nftmarketaddress, nftaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

export default function MyAssets() {
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
        const tokenContract = new ethers.Contract(nftaddress, NFT.abi, signer)
        const data = await marketContract.fetchMyNFTs()

        const items = await Promise.all(data.map(async i => {
            const tokenUri = await tokenContract.tokenURI(i.tokenId)
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

    //this is new, but there are errors from the web page
    async function burnNft(tokenId) {
        const web3modal = new Web3Modal();
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        //interact with nft contract
        const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        const tokenContract = new ethers.Contract(nftaddress, NFT.abi, signer)

        await marketContract.burnNFT(tokenId)
        await tokenContract.burnToken(tokenId)
        
        loadNFTs()
        //router.push('/')
        //this works but need to wait for the transaction to be confirmed
        //console.log(transaction.toNumber())




        //Currently the problem is that the tokenIds is the one that is created, it should separate between the owned NFT and minted
    }


    if (loadingState === 'loaded' && !nfts.length) return (
        <h1 className="py-10 px-20 text-3xl">No assets owned</h1>
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
                                    <p className = "text-xs font-bold text-white">{nft.name}</p>
                                    {
                                        nft.owners.map((owner, j) => (
                                                (<p className = "text-xs font-bold text-white">{owner}</p>)
                                        )
                                        )
                                    }
                                    
                                </div>

                                <div className = "p-4 pg-black">    
                                <button className= "w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => burnNft(nft.tokenId)}>Burn</button>
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