//- my-assets.js => your own assets if its not put on sale
//"My Digital Assets" Page



import {ethers} from 'ethers'
// for useState and useEffect, see this https://medium.com/recraftrelic/usestate-and-useeffect-explained-cdb5dc252baf
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import {useRouter} from 'next/router'
//import {BrowserRouter, Routes, Route, Navigate, Link} from 'next/router'
import Link from 'next/link'


import {
    nftmarketaddress, nftaddress
} from '../config'

// import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFT.sol/NFT.json'

export default function MyAssets() {
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    const router = useRouter()
    const [formInput, updateFormInput] = useState('')
    
    useEffect (() => {
        loadNFTs()
    }, [])

    async function loadNFTs() {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        

        const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        const data = await marketContract.fetchMyNFTs()

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
                date: meta.data.date,
                owners: i.warehouses
                
            }
            return item
        }))
        console.log(items)
        setNfts(items)
        setLoadingState('loaded')


    }

    async function burnNft(tokenId) {
        const web3modal = new Web3Modal();
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        //interact with nft contract
        const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        // const tokenContract = new ethers.Contract(nftaddress, NFT.abi, signer)

        const transaction = await marketContract.burnToken(tokenId)
        
        await transaction.wait()
        router.push('/my-assets')
        loadNFTs()
    }

    async function requestNFT(nft) {
        // console.log(formInput)
        const address = formInput
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
    
        const signer = provider.getSigner()
        const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        const prices = ethers.utils.parseUnits(nft.price.toString(), 'ether')
        
        const transaction = await contract.createRequest(nft.tokenId, address, {
          value: prices
        })
        
    
        await transaction.wait()
        loadNFTs()
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
                                
                                <div className = "p-4 pg-black flex justify-end">    
                                    <button position = "absolute" className= "w-full bg-pink-500 text-white font-bold py-1 px-7 rounded" onClick={() => burnNft(nft.tokenId)}>Burn</button>
                                </div>

                                <img src = {nft.image} className = "rounded" />
                                
                                <div className = "p-4 bg-black">
                                    <p className = "text-xs font-bold text-white">Username: {nft.name}</p>
                                    <p className = "text-xs font-bold text-white">Created on {nft.date}</p>
                                    <p className = "text-xs font-bold text-white">Owners: </p>
                                    {
                                        nft.owners.map((owner, j) => (
                                                (<p key = {j} className = "text-xs font-bold text-white">- {owner}</p>)
                                        )
                                        )
                                    }
                                    
                                </div>
                                <div className = "flex justify-center">

                                <br></br><select 
                                    id="large" 
                                    onChange={e => updateFormInput(e.target.value)}
                                    className="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">                       
                                        <option value = '' selected>Warehouse to be Sent</option>
                                        <option value='0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'>Account 3</option>
                                </select>
                                    <div className = "p-4 pg-black flex justify-end">    
                                        <button className= "w-quarter bg-pink-500 text-white font-bold py-1 px-4 rounded" onClick={() => requestNFT(nft)}>Request</button>
                                        <Link
                                        href={`/detail-page?index=${nft.tokenId}`} // the data
                                        >Details
                                        </Link>
                                    </div>
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