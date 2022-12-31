//- create-item.js => the logic behind minting an nft
//"Sell Digital Assets" Page

import {useState} from 'react'
import {ethers} from 'ethers'

//to interact with ipfs, uploading and downloading files
import {create as ipfsHttpClient} from 'ipfs-http-client'

//to route to different route'
import {useRouter} from 'next/router'
import Web3Modal from 'web3modal'


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

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

//default function of this file
export default function CreateItem() {
    
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({price: '', name: '', description: ''})
    const router = useRouter()

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
        const {name, description, price} = formInput
        if (!name || !description || !price || !fileUrl) return  
        const data = JSON.stringify({
            name, description, image: fileUrl
        })

        try{
            const added = await client.add(data)
            const url = `${dedicateEndPoint}/${added.path}`
            /*after file is uploaded to IPFS, pass the URL to save it on Polygon*/
            createSale(url)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    //put the nft into sale or market
    async function createSale(url) {
        const web3modal = new Web3Modal();
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        
        //interact with nft contract
        let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
        
        //create the token
        //@see NFT.sol
        let transaction = await contract.createToken(url)
        //wait for transaction to succeed
        let tx = await transaction.wait()

        //we wanna get the tokenid returned from the transaction
        // thus, dp modification based on the return value
        let event = tx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber()

        const price = ethers.utils.parseUnits(formInput.price, 'ether')

        contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()
        
        //@see NFTMarket.sol
        transaction = await contract.createMarketItem(
            nftaddress, tokenId, price, {value: listingPrice}
        )

        await transaction.wait()
        router.push('/')
    }


    //Here will have to update the formInput into recipent address, fragile status. 
    //I suppose price is not needed, but it is used in many files currently
    return (
        <div className = "flex justify-center">
            <div className = "w-1/2 flex flex-col pb-12">
                <input 
                    placeholder = "Asset Name"
                    className = "mt-8 border rounded p-4"
                    onChange={e => updateFormInput({ ...formInput, name: e.target.value})}
                />
                <textarea
                    placeholder = "Asset Description"
                    className = "mt-2 border rounded p-4"
                    onChange = {e => updateFormInput({ ...formInput, description: e.target.value})}
                />
                <input 
                    placeholder = "Asset Price in MATIC"
                    className = "mt-2 border rounded p-4"
                    onChange={e => updateFormInput({ ...formInput, price: e.target.value})}
                />
                <input
                    type = "file"
                    name = "Asset"
                    className = "my-4"
                    onChange= {onChange}
                />
                {
                    fileUrl && (
                        <img className = "rounded mt-4" width= "350" src={fileUrl} />
                    )
                }
                <button 
                    onClick = {createItem}
                    className = "font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
                >
                    Create Digital Asset
                </button>
            </div>
        </div>
    )

}