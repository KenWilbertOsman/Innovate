import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import axios from 'axios'
import { ethers } from 'ethers'
import LogoNavbar from "../components/LogoNavbar"


import {
    nftmarketaddress, nftaddress
} from '../config'

import Market from '../artifacts/contracts/NFT.sol/NFT.json'

export default function Detail() {

    const router = useRouter();
    const [nfts, setNfts] = useState([])
    let data = {}

    useEffect(() => {
        if (router.isReady) {
            data = router.query;
            loadNFTDetails()
        }
    }, [router.isReady]);

    async function loadNFTDetails() {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()


        const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

        const index = parseInt(data['index'])
        // console.log(index)
        const nftDetail = await marketContract.fetchNFT(index)

        const items = await Promise.all(nftDetail.map(async i => {
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
                address: meta.data.recaddress,
                fragile: meta.data.fragile,
                date: meta.data.date,
                owners: i.warehouses,
                mass: meta.data.mass,
                userphone: meta.data.userphone,
                recname:meta.data.recname,
                recphone: meta.data.recphone  

            }
            return item
        }))

        // console.log(items)
        setNfts(items)


    }
    return (
        <div className='font-serif'> 
        <LogoNavbar/>
        <div className='mx-20 mt-20 mb-44'>
            <div className="font-serif box-border border-4 items-center justify-center">
                <div className="grid grid-cols-2 gap-4 p-4">
                    {
                        nfts.map((nft, i) => (
                            <div key={i}>
                                <div className="text-2xl">No. {nft.tokenId}</div>
                                
                            </div>
                        ))
                    }

                    {
                        nfts.map((nft, i) => (
                        <div key = {i} className='text-xl flex flex-row text-end justify-center'>
                        <div className='justify-items-end basis-1/2'>Mass:
                            <span className='mx-4' id="mass">{nft.mass}</span>kg
                        </div>
                        <div className='basis-1/2 font-bold uppercase mx-3'>{nft.fragile} <span class = "font-normal">Parcel</span>
                </div>
                        </div>  
                        ))
                    }

                    {
                        nfts.map((nft, i) => (
                            <div key={i} className="col-span-1 border shadow rounded-xl overflow-hidden w-full h-96">
                                <img src={nft.image} className="rounded w-full h-full" />
                            </div>
                        ))
                    }
                    
                    {
                        nfts.map((nft,i) => (
                    <div className='m-4'>
                        <h1 className='text-theme-peach text-2xl font-semibold tracking-wide'>Sender Details</h1>
                        <div className='leading-loose my-2'>
                            <div className='flex flex-row'>
                                <div className='basis-1/2'>Sender Username</div>
                                <div className='basis-1/2 '>
                                    <span className='float-right'>{nft.name}
                                    </span>
                                </div>
                            </div>
                            <div className='flex flex-row'>
                                <div className='basis-1/2'>Sender Phone No</div>
                                <div className='basis-1/2 '>
                                    <span className='float-right'>{nft.userphone}
                                    </span>
                                </div>
                            </div>
                            <div className='flex flex-row'>
                                <div className='basis-1/2'>Sent Date</div>
                                <div className='basis-1/2 '>
                                    <span className='float-right'>{nft.date}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <h1 className='text-theme-peach text-2xl font-semibold tracking-wide mt-5'>Recipient Details</h1>
                        <div className='leading-loose my-2'>
                            <div className='flex flex-row'>
                                <div className='basis-1/2'>Recipient Username</div>
                                <div className='basis-1/2 '>
                                    <span className='float-right'>{nft.recname}
                                    </span>
                                </div>
                            </div>
                            <div className='flex flex-row'>
                                <div className='basis-1/2'>Recipient Address</div>
                                <div className='basis-1/2 '>
                                    <span className='float-right'>{nft.address}
                                    </span>
                                </div>
                            </div>
                            <div className='flex flex-row'>
                                <div className='basis-1/2'>Recipient Phone No</div>
                                <div className='basis-1/2 '>
                                    <span className='float-right'>{nft.recphone}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                        ))
                    }
                </div>
            </div>
            <div className='mt-10 mx-5'>
                <div className='flex '>
                    <div className='justify-center items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                        </svg>
                    </div>
                    <div className='mx-2 p-1.5'>
                        <span className='align-middle'>Starting Address</span>
                    </div>
                </div>
                <div className='justify-center items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-10 h-10">
                        <path fill-rule="evenodd" d="M12 2.25a.75.75 0 01.75.75v16.19l2.47-2.47a.75.75 0 111.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0l-3.75-3.75a.75.75 0 111.06-1.06l2.47 2.47V3a.75.75 0 01.75-.75z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div className='flex '>
                    <div className='justify-center items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                        </svg>
                    </div>
                    <div className='mx-2 p-1.5'>
                        <span className='align-middle'>Previous Warehouse</span>
                    </div>
                </div>
                <div className='justify-center items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-10 h-10">
                        <path fill-rule="evenodd" d="M12 2.25a.75.75 0 01.75.75v16.19l2.47-2.47a.75.75 0 111.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0l-3.75-3.75a.75.75 0 111.06-1.06l2.47 2.47V3a.75.75 0 01.75-.75z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div className='flex '>
                    <div className='justify-center items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                        </svg>
                    </div>
                    <div className='mx-2 p-1.5'>
                        <span className='align-middle'>Current Warehouse</span>
                    </div>
                </div>
                <div className='justify-center items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-10 h-10">
                        <path fill-rule="evenodd" d="M12 2.25a.75.75 0 01.75.75v16.19l2.47-2.47a.75.75 0 111.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0l-3.75-3.75a.75.75 0 111.06-1.06l2.47 2.47V3a.75.75 0 01.75-.75z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div className='flex '>
                    <div className='justify-center items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                        </svg>
                    </div>
                    <div className='mx-2 p-1.5'>
                        <span className='align-middle'>Recipient Address</span>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}