//- create-item.js => the logic behind minting an nft
//"Sell Digital Assets" Page

import { useState } from 'react'
import { ethers } from 'ethers'
import ShopNavbar from "../components/ShopNavbar";

import {getSession} from 'next-auth/react'

//to interact with ipfs, uploading and downloading files
import { create as ipfsHttpClient } from 'ipfs-http-client'

//to route to different route'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import {sha1} from 'crypto-hash' 

//These keys are from https://www.youtube.com/watch?v=QyYEEXNq7r0
//There are no free version for ipfs infura already, its youtuber didnt hide the keys lol
//but idk if there are any security concern, so far i check they can see the files that we upload to ipfs
const projectId = '2DE7of6yoq13YKes8LJX0QK4W9p'
const projectSecret = 'e5f7ff545c3f92a1f711fb3e3154dd1f'

const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const options = {
    host: 'ipfs.infura.io',
    protocol: 'https',
    port: 5001,
    apiPath: '/api/v0',
    headers: {
        authorization: auth
    }
};

const dedicateEndPoint = 'https://opensee.infura-ipfs.io/ipfs';
const client = ipfsHttpClient(options);

//const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
    nftaddress, nftmarketaddress
} from '../config.js'

//import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFT.sol/NFT.json'

//default function of this file
export default function CreateItem() {

    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ username: '', useraddress: '', userphone: '', recname: '', recphone: '', recaddress: '', fragile: '', mass: '', hash:'' })
    const router = useRouter()
    const [price, setPrice] = useState("0")
    const [popup, setPopup] = useState(false)
    const [hashed, setHashed] = useState("")
    const [loadingState, setLoadingState] = useState("not-loaded")

    //this asynchronous function is to upload the image into the url
    async function onChange(e) {
        const file = e.target.files[0]
        try {
            const added = await client.add(
                file,
                {
                    progress: (prog) => console.log(`received: ${prog}`)
                }

            )
            //HAVE TO CHNGE THE IPFS URL
            //const url = `https://ipfs.infura.io/ipfs/${added.path}`
            const url = `${dedicateEndPoint}/${added.path}`
            console.log(url)
            setFileUrl(url)


        } catch (e) {
            console.log("ipfs upload error")
        }

    }


    async function createItem() {
        const { username, useraddress, userphone, recname, recaddress, recphone, fragile, mass} = formInput
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const fullDate = new Date();
        let month = months[fullDate.getMonth()];
        let dates = fullDate.getDate();
        let year = fullDate.getFullYear();
        
        let date = `${month} ${dates}, ${year}`
        
        let hash = await sha1(username)
        if (!username || !useraddress || !userphone || !recname || !recaddress || !recphone || !fragile || !fileUrl || !mass) return
        const data = JSON.stringify({
            username, useraddress, userphone, recname, recaddress, recphone, fragile, image: fileUrl, date, mass, hash
        })
        try {
            const added = await client.add(data)
            const url = `${dedicateEndPoint}/${added.path}`
            /*after file is uploaded to IPFS, pass the URL to save it on Polygon*/
           createSale(url)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }

        setLoadingState("loaded")
        setHashed(hash)
    }

    //put the nft into sale or market
    async function createSale(url) {
        const web3modal = new Web3Modal();
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        //interact with nft contract

        let prices = ethers.utils.parseUnits(price, 'ether')

        let account4Address = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
        let contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()
        let transaction = await contract.createToken(url, prices, account4Address, { value: listingPrice })
        await transaction.wait()
        
        setPopup(true)
        // //create the token
        // //@see NFT.sol
        // let transaction = await contract.createToken(url)
        // //wait for transaction to succeed
        // let tx = await transaction.wait()

        // //we wanna get the tokenid returned from the transaction
        // // thus, dp modification based on the return value
        // let event = tx.events[0]
        // let value = event.args[2]
        // let tokenId = value.toNumber()

        // contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        // let listingPrice = await contract.getListingPrice()
        // listingPrice = listingPrice.toString()

        // let prices = ethers.utils.parseUnits(price, 'ether')
        // //@see NFTMarket.sol
        // let account4Address = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
        // transaction = await contract.createMarketItem(

        //     nftaddress, tokenId, prices, account4Address ,{value: listingPrice}
        // )

        // await transaction.wait()
        // router.push('/')
    }

    async function userDone(){
        setPopup(false)
        router.push('/create-item')
    }


    //Here will have to update the formInput into recipent address, fragile status. 
    //I suppose price is not needed, but it is used in many files currently
    if (popup && loadingState == "loaded") return (
        <div>
        <ShopNavbar/>
        <div className='mx-20 mt-20'>
        <div className = "flex flex-col items-center rounded-lg shadow-xl h-4/6">
            <h1 className = "text-lg mt-2 mx-4 text-black font-semibold text-center">
                Here is Your Tracking Number
            </h1>
            <h3 class="text-center text-theme-blue font-bold text-lg break-normal m-5 break-all"> {hashed}</h3>
            <button 
            className = " my-5 w-36 mx-10 h-12 bg-theme-peach text-white rounded-md hover:shadow-lg font-sans"
            onClick = {userDone}>
            Done
            </button>
        </div>
        </div>
        </div>

    )
    return (
        <div className='font-serif'> 
        <ShopNavbar/>
        <div className="flex justify-center">
            <div className="w-1/2 flex flex-col pb-12">
                <input
                    placeholder="Name"
                    className="mt-8 border rounded p-4"
                    onChange={e => updateFormInput({ ...formInput, username: e.target.value })}
                />
                <textarea
                    placeholder="Full Address"
                    className="mt-2 border rounded p-4"
                    onChange={e => updateFormInput({ ...formInput, useraddress: e.target.value })}
                />
                <input
                    type="tel"
                    placeholder="Mobile Number"
                    className="mt-2 border rounded p-4"
                    pattern="[0-9].{9,}" required
                    onChange={e => updateFormInput({ ...formInput, userphone: e.target.value })} /*10 or more number required*/
                    
                />
                <input
                    placeholder="Recipient Name"
                    className="mt-8 border rounded p-4"
                    onChange={e => updateFormInput({ ...formInput, recname: e.target.value })}
                />
                <textarea
                    placeholder="Recipient Full Address"
                    className="mt-2 border rounded p-4"
                    onChange={e => updateFormInput({ ...formInput, recaddress: e.target.value })}
                />
                <input
                    type="tel"
                    placeholder="Recipient Mobile Number"
                    className="mt-2 border rounded p-4"
                    pattern="[0-9].{9,}" required
                    onChange={e => updateFormInput({ ...formInput, recphone: e.target.value })} /*10 or more number required*/
                />
                <br></br><input
                    type="number"
                    placeholder="Parcel Weight (in kg)"
                    className="mt-2 border rounded p-4"
                    onChange={e => updateFormInput({ ...formInput, mass: e.target.value })} /*10 or more number required*/
                />
                <br></br><select
                    id="large"
                    onChange={e => updateFormInput({ ...formInput, fragile: e.target.value })}
                    className="block w-full px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value = "" selected>Fragile Status</option>
                    <option value="Fragile">Fragile</option>
                    <option value="Non-Fragile">Non-Fragile</option>
                </select><br></br>
                <div class="flex items-center justify-center w-full">
                <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg aria-hidden="true" class="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to Upload Parcel Image</span> or Drag and Drop</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">PNG or JPG</p>
                    </div>
                <input id="dropzone-file" type="file" class="hidden" name = "Asset" onChange = {onChange}/>
                </label>
                </div> 
                {
                    fileUrl && (
                        <img className="rounded mt-4" width="w-full" src={fileUrl} />
                    )
                    
                    
                }
                <button
                    onClick={createItem}
                    className="font-bold mt-4 bg-theme-blue text-white rounded p-4 shadow-lg"
                >
                    Create Digital Asset
                </button>
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
    else if (session.user._doc.role == "warehouse"){
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
  