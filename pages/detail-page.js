import { useRouter } from 'next/router'
import {useEffect, useState} from 'react'
import Web3Modal from 'web3modal'
import axios from 'axios'
import {ethers} from 'ethers'


import {
    nftmarketaddress, nftaddress
} from '../config'

import Market from '../artifacts/contracts/NFT.sol/NFT.json'

export default function Detail () {
    
    const router = useRouter();
    const [nfts, setNfts] = useState([])
    let data = {}

    useEffect(() => {
        if(router.isReady){
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
    return(
    <div className= "box-border mx-20 mt-20 mb-44 border-4 w-45 flex items-center justify-center h-screen">
        <div className = "p-4">
        {
            nfts.map((nft,i) => (
                <div className = "border shadow rounded-xl overflow-hidden">
                    <img src = {nft.image} className = "rounded" />
                    
                    <h1 className="flex justify-center">Token Id: {nft.tokenId}</h1>
                </div>
                
                )
            )
        }
         

    </div>
        </div>
    )
}