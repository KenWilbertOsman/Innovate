import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import axios from 'axios'
import { ethers } from 'ethers'


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
        console.log(index)
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
                address: meta.data.useraddress,
                fragile: meta.data.fragile,
                date: meta.data.date,
                owners: i.warehouses

            }
            return item
        }))

        console.log(items)
        setNfts(items)


    }
    return (
        <div className="box-border mx-20 mt-20 mb-44 border-4 w-45  items-center justify-center h-screen">
            <div className="grid grid-cols-2 gap-4 p-4">

            <div>Token ID: <span>1</span></div>
            <div>
                <span>Mass</span>
                <span> Fragile</span>
            </div>
                {
                    nfts.map((nft, i) => (
                        
                        <div key={i} className="col-span-1 border shadow rounded-xl overflow-hidden">
                            <img src={nft.image} className="rounded" />
                            {
                /* <h1 className="flex justify-center">Token Id: {nft.tokenId}</h1> */}
                        </div>
                    )
                    )
                }
                <div className='m-4'>
                    <h1 className='text-theme-peach text-3xl font-semibold tracking-wide'>Sender Details</h1>
                    <div className ='text-2xl leading-loose my-2'>
                    <span className='flex flex-row'>
                        <span className='basis-1/2'>Sender Username</span>
                        <span className='basis-1/2'>
                            <p className='text-end'>Ken Wilbert Osman</p>
                        </span>
                    </span>
                    <span className='flex flex-row'>
                        <span className='basis-1/2'>Sender Phone No</span>
                        <span className='basis-1/2'>
                            <p className='text-end'>012-3246910</p>
                        </span>
                    </span>
                    <span className='flex flex-row'>
                        <span className='basis-1/2'>Sent Date</span>
                        <span className='basis-1/2'>
                            <p className='text-end'>14 Nov 2022</p>
                        </span>
                    </span>
                    </div>
                    <h1 className='text-theme-peach text-3xl font-semibold tracking-wide mt-5'>Recipient Details</h1>
                    <div className ='text-2xl leading-loose my-2'>
                    <span className='flex flex-row'>
                        <span className='basis-1/2'>Recipient Username</span>
                        <span className='basis-1/2'>
                            <p className='text-end'>Miyazaki Nanako</p>
                        </span>
                    </span>
                    <span className='flex flex-row'>
                        <span className='basis-1/2'>Recipient Address</span>
                        <span className='basis-1/2'>
                            <p className='text-end'>Tokyo, Japan</p>
                        </span>
                    </span>
                    <span className='flex flex-row'>
                        <span className='basis-1/2'>Recipient Phone No</span>
                        <span className='basis-1/2'>
                            <p className='text-end'>02-32469103</p>
                        </span>
                    </span>
                    </div>      
                </div>
            </div>
            <div>hi world</div>
        </div>

    )
}