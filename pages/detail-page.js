import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import axios from 'axios'
import { ethers } from 'ethers'
import WarehouseNavbar from "../components/WarehouseNavbar"
import AdminNavbar from "../components/AdminNavbar"
import { getSession, useSession } from 'next-auth/react'


import {
    nftmarketaddress
} from '../config'

import Market from '../artifacts/contracts/NFT.sol/NFT.json'

export default function Detail() {

    const { data: session } = useSession()
    const router = useRouter();
    const [nfts, setNfts] = useState([])
    let data = {}

    useEffect(() => {
        if (router.isReady) {
            data = router.query;
            loadNFTDetails()
        }
    }, [router.isReady]);

    
    //request data GET from /pages/api/usernameRetrieve
    async function requestData(strings) {
        const option = {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }

        }
        let page = `http://localhost:3000/api/usernameRetrieve${strings}`

        const response = await fetch(page, option)
        return await response.json()
    }

    
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
                recname: meta.data.recname,
                recphone: meta.data.recphone

            }
            return item
        }))
        // console.log(nft[i]['owners'])
        let accounts = items[0]['owners']
        let strings = '?'
        for (let i = 0; i < accounts.length; i++) {
            strings += `q=${accounts[i]}&`
        }
        strings += "filter=username&find=metamask"


        //to GET the data from mongodb
        const fetchedAcc = await requestData(strings)

        //to take the username from the fetched GET data
        let accountsFetch = []
        for (let i = 0; i < (accounts.length); i++) {
            accountsFetch[i] = fetchedAcc.data[i]['username']

        }
        items[0]['addressName'] = accountsFetch

        setNfts(items)
    }
    return (
        <div className='font-serif'>
            {NavigationBar(session)}
            <div className='min-h-screen flex flex-col'>
                <div className="font-serif box-border bg-gray-100 items-center justify-center mt-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-1 lg:p-7 md:p-6">
                        {
                            nfts.map((nft, i) => (
                                <div key={i} className="rounded-xl overflow-hidden h-96 w-full col-span-2 lg:col-span-1">
                                    <img src={nft.image} className="rounded w-full h-full object-fill" />
                                </div>
                            ))
                        }
                        {
                            nfts.map((nft, i) => (
                                <div className='m-2 col-span-2 lg:col-span-1 lg:m-4' >
                                    <div key={i} className="flex flex-row text-xs lg:text-xl mt-2 mb-3">
                                        <div className="basis-1/2">Mass:{nft.mass}kg</div>
                                        <div className="basis-1/2 text-right">
                                            <span className="font-bold uppercase">
                                                {nft.fragile}
                                            </span> Parcel
                                        </div>
                                    </div>
                                    <h1 className='text-theme-peach text-xl font-semibold tracking-wide lg:text-2xl'>Sender Details</h1>
                                    <div className='leading-loose my-2 text-xs lg:text-base'>
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
                                    <h1 className='text-theme-peach text-xl font-semibold tracking-wide mt-5 lg:text-2xl'>Recipient Details</h1>
                                    <div className='leading-loose my-2 text-xs lg:text-base'>
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
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 m-10'>
                    {/* the format that should look like */}

                    {
                        nfts.map((nft, i) => (
                            <div class="timeline-container ">
                                {nft.addressName.slice(0).reverse().map((name, j) => (
                                    <div class="timeline-item flex mb-2">
                                        <div class="flex">
                                            <div class="timeline-item-line h-full w-2 bg-gray-500"></div>
                                            <div class="timeline-item-content w-full ml-4">
                                                <h3 class="timeline-item-title font-bold">#{j + 1} Location </h3>
                                                <p class="timeline-item-description">
                                                    {name}
                                                </p>
                                                <p class="timeline-item-date italic">{nft.date}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div class="timeline-item flex mb-2 text-gray-300">
                                    <div class="flex">
                                        <div class="timeline-item-line h-full w-2 bg-gray-500"></div>
                                        <div class="timeline-item-content w-full ml-4">
                                            <h3 class="timeline-item-title font-bold">#2 Location</h3>
                                            <p class="timeline-item-description">
                                                Warehouse 1
                                            </p>
                                            <p class="timeline-item-date italic">ETA: Aug. 2023</p>
                                        </div>
                                    </div>
                                </div>  
                            </div>
                        ))
                    }


                    {
                        nfts.map((nft, i) => (
                            <div class="timeline-container text-gray-300">
                                 <div class="timeline-item flex mb-2">
                                    <div class="flex">
                                        <div class="timeline-item-line h-full w-2 bg-gray-500"></div>
                                        <div class="timeline-item-content w-full ml-4">
                                            <h3 class="timeline-item-title font-bold">#3 Location</h3>
                                            <p class="timeline-item-description">
                                                Warehouse 2
                                            </p>
                                            <p class="timeline-item-date italic">ETA: Sept. 2023</p>
                                        </div>
                                    </div>
                                </div>   
                                <div class="timeline-item flex mb-2">
                                    <div class="flex">
                                        <div class="timeline-item-line h-full w-2 bg-gray-500"></div>
                                        <div class="timeline-item-content w-full ml-4">
                                            <h3 class="timeline-item-title font-bold">Reached Final Point</h3>
                                            <p class="timeline-item-description">
                                                Recipient Address: {nft.address}
                                            </p>
                                            <p class="timeline-item-date italic">ETA: Oct. 2023</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
function NavigationBar(session) {
    if (session.user._doc.role == "warehouse") {
        return <WarehouseNavbar />
    }
    else if (session.user._doc.role == "admin") {
        return <AdminNavbar />
    }

}

export async function getServerSideProps({ req }) {
    const session = await getSession({ req })

    //if session is not authorised
    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false
            }
        }
    }
    else if ((session.user._doc.role == "admin" && !session.user.email.includes("@dreamcatcher.com"))) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }
    //authorize user return session
    return {
        props: { session }
    }
}
