//- my-assets.js => your own assets if its not put on sale
//"My Digital Assets" Page

import { ethers } from 'ethers'
// for useState and useEffect, see this https://medium.com/recraftrelic/usestate-and-useeffect-explained-cdb5dc252baf
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { useRouter } from 'next/router'
import WarehouseNavbar from "../components/WarehouseNavbar"
import {getSession} from 'next-auth/react'

import {
    nftmarketaddress
} from '../config'

// import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFT.sol/NFT.json'

export default function MyAssets() {
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    const router = useRouter()
    const [formInput, updateFormInput] = useState('')
    const [metamaskAcc, setMetamaskAcc] = useState([])
    
    useEffect(() => {
        loadNFTs()
        loadWarehouseAcc()
    }, [])



    async function loadWarehouseAcc() {
        const option = {
            method: "GET",
            headers:{'Content-Type': 'application/json'}
            
        }

        await fetch('http://localhost:3000/api/dataRetrieve', option)
        .then(res => res.json()).then((data) => {
            setMetamaskAcc(data.data);
        })
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
                owners: i.warehouses,
                mass: meta.data.mass

            }
            return item
        }))

        //just fetch all data at once instead of usiing for loop
        
        let accounts = []
        let counts = {nftCount:[], eachNftOwner:[]}
        let nftCounting = []
        let eachNftOwners = []
        let allMetamaskAcc = []
        let filteredMetamaskAcc
        let counting = 0
        let strings = '?'

        for (let i = 0; i<items.length; i++){
            nftCounting[i] = i
            eachNftOwners[i] = items[i]['owners'].length
            accounts = items[i]['owners']
            for (let j = 0; j < accounts.length; j++){
                
                allMetamaskAcc[counting] = accounts[j]
                counting += 1
            }
            
        }  
        counts['nftCount'] = nftCounting
        counts['eachNftOwner'] = eachNftOwners    

        filteredMetamaskAcc = allMetamaskAcc.filter((value, index, self) => self.indexOf(value) === index) 

        for (let i = 0; i<filteredMetamaskAcc.length; i++){
            strings += `metamaskAcc=${filteredMetamaskAcc[i]}&`
        }  
        strings += 'filter=username'
        

        const fetchedAcc = await requestData(strings)

        let accountsFetch = []
            for (let i = 0; i<(allMetamaskAcc.length) - 1; i++){
                accountsFetch[i] = fetchedAcc.data[i]['username']
        }

        let nameSeparated = []
        let accSeparated = []
        let count = 0

        for (let i = 0; i < counts.nftCount.length; i++){
            let tempNameArray = []
            let tempAccArray = []
            for (let j = 0; j<counts.eachNftOwner[i]; j++){
                tempAccArray[j] = allMetamaskAcc[count]
                tempNameArray[j] = fetchedAcc.data[filteredMetamaskAcc.indexOf(tempAccArray[j])]
                count += 1
            }
            nameSeparated[i] = tempNameArray
            accSeparated[i] = tempAccArray
        }
        
        for (let i = 0; i < items.length; i++){
            items[i]['ownerName'] = nameSeparated[i]
     
        }

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
        
        <div className='font-serif'> 
        <WarehouseNavbar/>
        <h1 className="py-10 px-20 text-3xl">No assets owned</h1>
        </div>
    )
    return (
        <div className='font-serif'> 
        <WarehouseNavbar/>
        <div className="flex justify-center">
            <div className="mx-10 my-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                    {
                        nfts.map((nft, i) => (
                            <div key={i} className="grid grid-rows-1 border shadow rounded-xl overflow-hidden">
                                <div className='row-start-1 relative'>
                                    <a href={`/detail-page?index=${nft.tokenId}`}>
                                        <div className='flex justify-end' >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 absolute m-4 cursor-pointer">
                                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd"
                                                    href={`/detail-page?index=${nft.tokenId}`} />
                                            </svg>
                                        </div>
                                    </a>
                                    
                                    <img src={nft.image} className="rounded object-cover h-96 w-screen" />
                                    
                                    <div className="bg-black inset-x-0 bottom-0 overflow-y-auto h-24">
                                        <p className="text-xs font-bold text-white m-2">Parcel Sender Name: {nft.name}</p>
                                        <p className="text-xs font-bold text-white m-2">Created on {nft.date}</p>
                                        <p className="text-xs font-bold text-white m-2">Past Parcel Warehouses: </p>

                                        {
                                            nft.ownerName.map((ownerName, j) => (
                                                (<p key={j} className="text-xs font-bold text-white m-2 break-all">- {ownerName['username']}</p>)
                                            ))
                                        }
                                        
                                    </div>
                                </div>
                                <div className="flex justify-center mx-4 my-5">
                                    <select
                                        id="large"
                                        onChange={e => updateFormInput(e.target.value)}
                                        className="block w-full text-base mx-3
                                        text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500
                                         focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                                          dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                  
                                        <option value='' selected>Warehouse to be Sent</option>
                                        {
                                            metamaskAcc.map((account, i) => (
                                                (<option key = {i} value={account.metamask}>{account.username}, {account.state}</option>)
                                            ))
                                        }
                                    </select>
                                    <div className="pg-black flex justify-end">
                                        <button className="w-quarter bg-theme-blue text-white font-bold py-1 px-4 rounded" onClick={() => requestNFT(nft)}>Request</button>
                                    </div>
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