//creator-dashboard.js => where you can see your nfts and the one u sold
//"Creator Dashboard" Page


import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import Link from "next/link"

import {
    nftmarketaddress, nftaddress
} from '../config'

import Market from '../artifacts/contracts/NFT.sol/NFT.json'



export default function Database() {
    const [nfts, setNfts] = useState([])
    const [filtered, setFiltered] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')

    //this is to call the loadnft once when the page is loaded
    useEffect(() => {
        loadNFTs();
        filterNFT("all");
    }, [])

    //this is to load the nft into the screen
    async function loadNFTs() {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()


        const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        //@see go to NFTMarket.sol
        const data = await marketContract.fetchAllNFT()

        const items = await Promise.all(data.map(async i => {
            const tokenUri = await marketContract.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                nextWarehouse: i.nextWarehouse,
                image: meta.data.image,
                name: meta.data.username,
                address: meta.data.useraddress,
                fragile: meta.data.fragile,
                date: meta.data.date,
                recAddress: meta.data.recaddress,
                recNumber: meta.data.recphone,
                mass: meta.data.mass
            }
            return item
        }))

        //this is to set the variable "nfts" with items
        setNfts(items)
        setLoadingState('loaded')

    }

    async function filterNFT(c) {

        if (c == "all") {
            setFiltered(nfts)
        }
        else if (c == "transit") {
            setFiltered(nfts.filter(i => (!i.completed && i.nextWarehouse != 0)))
        }
        else if (c == "warehouse") {
            setFiltered(nfts.filter(i => (!i.completed && i.nextWarehouse == 0)))
        }
        else if (c == "completed") {
            setFiltered(nfts.filter(i => i.completed))
        }

    }

    if (loadingState === 'loaded' && !nfts.length) return (
        <h1 className="py-10 px-20 text-3xl">No Items Created</h1>
    )
    else if (loadingState === 'loaded' & !filtered.length) return (
        <div>
            <div className="flex flex-row space-x-[50px]" id="myBtnContainer">
                <button className="font-bold mt-4 bg-theme-red text-white rounded py-2 px-12 shadow-lg" onClick={() => filterNFT("all")}> Show All</button>
                <button className="font-bold mt-4 bg-theme-red text-white rounded py-2 px-12 shadow-lg" onClick={() => filterNFT("transit")}> In Transit</button>
                <button className="font-bold mt-4 bg-theme-red text-white rounded py-2 px-12 shadow-lg" onClick={() => filterNFT("warehouse")}> In a Warehouse</button>
                <button className="font-bold mt-4 bg-theme-red text-white rounded py-2 px-12 shadow-lg" onClick={() => filterNFT("completed")}> Completed</button>
            </div>
            <h1 className="py-10 px-20 text-3xl">Filtered Items are Empty</h1>
        </div>
    )
    return (
        <div>
            <div className="flex flex-row space-x-[50px] " id="myBtnContainer">
                <button className="font-bold mt-4 bg-theme-red text-white rounded py-2 px-12 shadow-lg" onClick={() => filterNFT("all")}> Show All</button>
                <button className="font-bold mt-4 bg-theme-red text-white rounded py-2 px-12 shadow-lg" onClick={() => filterNFT("transit")}> In Transit</button>
                <button className="font-bold mt-4 bg-theme-red text-white rounded py-2 px-12 shadow-lg" onClick={() => filterNFT("warehouse")}> In a Warehouse</button>
                <button className="font-bold mt-4 bg-theme-red text-white rounded py-2 px-12 shadow-lg" onClick={() => filterNFT("completed")}> Completed</button>
            </div>
            <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                    {

                        filtered.map((nft, i) => (
                            <div key={i} className="border shadow rounded-xl overflow-hidden">
                                <a href={`/detail-page?index=${nft.tokenId}`}>
                                    <div className='flex justify-end' >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 absolute m-4 cursor-pointer">
                                            <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd"
                                                href={`/detail-page?index=${nft.tokenId}`} />
                                        </svg>
                                    </div>
                                </a>
                                <img src={nft.image} className="rounded" />
                                <div className="p-4 bg-black">
                                    <p className="text-xl font-bold text-white">Recipient Address: {nft.recAddress}</p>
                                    <p className="text-xl font-bold text-white">Recipient Mobile: {nft.recNumber}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )

}