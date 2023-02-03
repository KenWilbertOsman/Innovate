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
                owners: i.warehouses,
                mass: meta.data.mass

            }
            return item
        }))

        console.log(items)
        setNfts(items)


    }
    return (
        <div className='mx-20 mt-20 mb-44'>
            <div className="font-serif box-border border-4 items-center justify-center">
                <div className="grid grid-cols-2 gap-4 p-4">
                    {
                        nfts.map((nft, i) => (
                            <div key={i} >
                                {<div className="text-3xl">Token ID: {nft.tokenId}</div>}
                            </div>
                        ))
                    }
                    <div className='text-xl flex flex-row text-end justify-center'>
                        <div className='justify-items-end basis-1/2'>Mass:
                            <span className='mx-4' id="mass">X</span>kg
                        </div>
                        <div className='basis-1/2'> Fragile
                            <input type="checkbox" disabled="disabled" checked="checked"
                                className='h-5 w-5 mx-4 justify-center' id="isFragile"></input>
                        </div>
                    </div>
                    {
                        nfts.map((nft, i) => (
                            <div key={i} className="col-span-1 border shadow rounded-xl overflow-hidden">
                                <img src={nft.image} className="rounded" />
                            </div>
                        ))
                    }
                    <div className='m-4'>
                        <h1 className='text-theme-peach text-2xl font-semibold tracking-wide'>Sender Details</h1>
                        <div className='leading-loose my-2'>
                            <div className='flex flex-row'>
                                <div className='basis-1/2'>Sender Username</div>
                                <div className='basis-1/2 '>
                                    <span className='float-right'>Ken Wilbert Osman
                                    </span>
                                </div>
                            </div>
                            <div className='flex flex-row'>
                                <div className='basis-1/2'>Sender Phone No</div>
                                <div className='basis-1/2 '>
                                    <span className='float-right'>012-3246910
                                    </span>
                                </div>
                            </div>
                            <div className='flex flex-row'>
                                <div className='basis-1/2'>Sent Date</div>
                                <div className='basis-1/2 '>
                                    <span className='float-right'>14 Nov 2022
                                    </span>
                                </div>
                            </div>
                        </div>
                        <h1 className='text-theme-peach text-2xl font-semibold tracking-wide mt-5'>Recipient Details</h1>
                        <div className='leading-loose my-2'>
                            <div className='flex flex-row'>
                                <div className='basis-1/2'>Recipient Username</div>
                                <div className='basis-1/2 '>
                                    <span className='float-right'>Miyazaki Nanako
                                    </span>
                                </div>
                            </div>
                            <div className='flex flex-row'>
                                <div className='basis-1/2'>Recipient Address</div>
                                <div className='basis-1/2 '>
                                    <span className='float-right'>Tokyo, Japan
                                    </span>
                                </div>
                            </div>
                            <div className='flex flex-row'>
                                <div className='basis-1/2'>Recipient Phone No</div>
                                <div className='basis-1/2 '>
                                    <span className='float-right'>02-32469103
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>hi world</div>
        </div>
    )
}