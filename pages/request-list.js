
import { ethers } from 'ethers'
// for useState and useEffect, see this https://medium.com/recraftrelic/usestate-and-useeffect-explained-cdb5dc252baf
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import WarehouseNavbar from "../components/WarehouseNavbar"

import {getSession} from 'next-auth/react'

import {
    nftmarketaddress
} from '../config'

//import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFT.sol/NFT.json'

export default function RequestList() {
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')

    useEffect(() => {
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
                fragile: meta.data.fragile,
                owners: i.warehouses,
                mass: meta.data.mass,
                date:meta.data.date
            }
            return item
        }))
        let allMetamaskAcc = []
        let filteredMetamaskAcc
        let strings = '?'

        //to keep all the seller metamask account hex in order
        for (let i = 0; i<items.length; i++){
            let accounts = items[i]['seller']
            allMetamaskAcc[i] = accounts
        }  

        //to take the unique value of the seller metamask account
        filteredMetamaskAcc = allMetamaskAcc.filter((value, index, self) => self.indexOf(value) === index) 
        //to make the query based on the unique metamask account
        for (let i = 0; i<filteredMetamaskAcc.length; i++){
            strings += `q=${filteredMetamaskAcc[i]}&`
        }  

        strings += 'filter=username&filter=role&find=metamask'
        //to GET the data from mongodb
        const fetchedAcc = await requestData(strings)


        //to take the username from the fetched GET data

        let nameSeparated = []
        let accSeparated = []

        //since the fetching only take the unique, we have to rearrange the seller of the nft based on
        //the metamask account, cause unique value might result in 2 accounts only, and total nft is 3 (so 3 sellers in total)
        for (let i = 0; i < items.length; i++){
            accSeparated[i] = allMetamaskAcc[i]
            nameSeparated[i] = fetchedAcc.data[filteredMetamaskAcc.indexOf(accSeparated[i])]
        }

        for (let i = 0; i < items.length; i++){
            items[i]['sellerName'] = nameSeparated[i]
     
        }

        console.log(items)
        setNfts(items)
        setLoadingState('loaded')

    }

    async function requestData(strings){
        const option = {
        method: "GET",
        headers:{'Content-Type': 'application/json'}
            
        }
        let page = `http://localhost:3000/api/usernameRetrieve${strings}`

        const response = await fetch(page, option)
        return await response.json()
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



    async function declineRequestedNft(nft) {
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)

        const signer = provider.getSigner()
        const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

        const prices = ethers.utils.parseUnits(nft.price.toString(), 'ether')
        
        let transaction
        if (nft.sellerName.role == 'warehouse'){
            transaction = await contract.removeRequest(nft.tokenId, {
                value: prices
            })
        }
        else if (nft.sellerName.role == 'admin'){
            console.log(nft.tokenId)
            transaction = await contract.burnToken(nft.tokenId)
            
        }

        //if the previous owner is admin, then u burn it
        //if the previous owner is warehouse, then u send it back to the previous warehouse
        

        await transaction.wait()
        loadNFTs()
    }

    if (loadingState === 'loaded' && !nfts.length) return (
        <div className='font-serif'> 
        <WarehouseNavbar/>
        <h1 className="py-10 px-20 text-3xl">No parcel requested to you</h1>
        </div>
    )
    return (
        <div className='font-serif'> 
        <WarehouseNavbar/>
        <div className="flex justify-center">
            <div className="mx-10 my-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                    {
                        nfts.map((nft, i) => (
                            <div key={i} className="grid grid-rows-1 border border-zinc-800 shadow rounded-xl overflow-hidden ">
                                <div className="row-start-1 relative">
                                    <img src={nft.image} className="rounded object-fill h-96 w-screen" />
                                    <div className="bg-theme-blue inset-x-0 bottom-0 ">
                                        <p className="text-xs font-bold text-white m-2 ">Created on {nft.date} </p>
                                        <p className="text-xs font-bold text-white m-2 ">Previous Warehouse:  {nft.sellerName.username} </p>
                                    </div>
                                </div>
                                <div className="flex justify-center inset-x-0 bottom-0 overflow-y-visible h-20">
                                    <button className="w-half bg-green-500 text-white font-bold py-2 px-11 mx-auto my-4 rounded" onClick={() => acceptRequestedNft(nft)}>Accept</button>
                                    <button className="w-half bg-theme-red text-white font-bold py-2 px-11 mx-auto my-4 rounded" onClick={() => declineRequestedNft(nft)}>Decline</button>
                                </div>
                            </div>
                        ))
                    }
                </div>

            </div>

        </div>
        </div>
    )
}


export async function getServerSideProps({req}){
    const session = await getSession({req})
  
    //if session is not authorised
    if(!session){
      return{
        redirect: {
          destination: '/login',
          permanent:false
        }
      }
    }
    else if(session.user._doc.role != "warehouse" ){
        return{
          redirect: {
            destination: '/',
            permanent:false
          }
        }
      }
    //authorize user return session
    return {
      props: {session}
    }
  }