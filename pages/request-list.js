
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
    const [accUsername, setAccUsername] = useState([])

    useEffect(() => {
        loadNFTs()
    }, [])

    useEffect(() =>{
        loadUsername(nfts)
    }
    , [nfts])

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
                owners: i.warehouses,
                mass: meta.data.mass
            }
            return item
        }))

        const newItem = await loadUsername(items)

        setNfts(newItem)
        setLoadingState('loaded')

    }

    async function requestData(strings){
 
        const option = {
        method: "GET",
        headers:{'Content-Type': 'application/json'}
            
        }
        let page = `http://localhost:3000/api/usernameRetrieve${strings}`

        await fetch(page, option)
            .then((res) => {
                if(res.ok){
                    let a = Promise.resolve(res.json().then(response => setAccUsername(response.data)))
                }
                else{
                    let a = Promise.resolve(res.json().then(response => console.log(response.error)))
                }
                })
        
        // console.log(accUsername)
    }


    async function loadUsername(nft) {
        let temp_nfts = nft
        let accounts = []
        for (let i = 0; i<nft.length; i++){
            accounts = nft[i]['owners']
            let strings = '?'
            for (let i = 0; i < accounts.length; i++){
                strings += `metamaskAcc=${accounts[i]}&`
            }
            
            strings += "filter=username"
            await requestData(strings)
            temp_nfts[i]['ownerName'] = accUsername
        }  

        return nft
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
    async function declineRequestedNft(nft) {
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)

        const signer = provider.getSigner()
        const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

        const prices = ethers.utils.parseUnits(nft.price.toString(), 'ether')
        const transaction = await contract.removeRequest(nft.tokenId, {
            value: prices
        })

        await transaction.wait()
        loadNFTs()
    }

    if (loadingState === 'loaded' && !nfts.length) return (
        <div className='font-serif'> 
        <WarehouseNavbar/>
        <h1 className="py-10 px-20 text-3xl">No NFT requested to you</h1>
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
                            <div key={i} className="grid grid-rows-1 border shadow rounded-xl overflow-hidden ">
                                <div className="row-start-1 relative">
                                    <img src={nft.image} class="rounded object-fill h-96 w-screen" />
                                    <div className="bg-black inset-x-0 bottom-0 ">
                                        <p className="text-xs font-bold text-white m-2 ">Seller:  </p>
                                        <p className="text-xs font-bold text-white m-2 break-words ">{nft.seller}</p>
                                        <p className="text-xs font-bold text-white m-2">Owners:</p>
                                        {
                                            nft.ownerName.map((ownerName, j) => (
                                                (<p key={j} className="text-xs font-bold text-white m-2 break-all"> - {ownerName['username']}</p>)
                                            ))
                                        }
                                    </div>
                                </div>
                                <div className="flex justify-center inset-x-0 bottom-0 overflow-y-auto h-20">
                                    <button className="w-half bg-green-500 text-white font-bold py-2 px-11 mx-2 my-4 rounded" onClick={() => acceptRequestedNft(nft)}>Accept</button>
                                    <button className="w-half bg-theme-red text-white font-bold py-2 px-11 mx-2 my-4 rounded" onClick={() => declineRequestedNft(nft)}>Delete</button>
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