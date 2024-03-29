/**
 * Navigation bar for shop owner
 */

import React from 'react';
import Link from 'next/link'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import {useSession} from 'next-auth/react'
import '@fortawesome/fontawesome-free/css/all.css';


function ShopNavbar() {
    
    const router = useRouter()
    const [metamaskAcc, setMetamaskAcc] = useState([])
    const [formInput, updateFormInput] = useState({username:'', newAcc:''})
    const {data:curSession} = useSession()
    const [popup,setPopup] = useState(false)
    useEffect(() => {
        loadWarehouseAcc()
    }, [])

    async function loadWarehouseAcc() {
        updateFormInput({...formInput, username: curSession.user._doc.username})
        const option = {
            method: "GET",
            headers:{'Content-Type': 'application/json'}
            
        }

        await fetch('http://localhost:3000/api/dataRetrieve', option)
        .then(res => res.json()).then((data) => {
            let data_res = data.data
            //sort based on the city first a
            data_res = data_res.sort((a, b) => (a.city> b.city) ? 1 : -1);
            
            setMetamaskAcc(data_res);
            
        })
    }

    async function replaceDefaultWarehouse() {
        if (formInput.newAcc != ''){
        // console.log(filterName[0].address)
        // data_res = data_res.filter(object => object.address != cur_session.user._doc.address)
        const option = {
            method: "POST",
            headers:{'Content-Type': 'application/json'},
            body:JSON.stringify(formInput)
        }

        await fetch('http://localhost:3000/api/replace', option)
        .then((res) => {
            if(res.ok){
                setPopup(true)
                // router.reload('/')
            }
            else{
                let a = Promise.resolve(res.json().then(response => setDataError(response['message'])))
            }
            })
        }
    }
    return (
        <nav className="p-7 bg-gradient-to-r from-slate-100 to-theme-blue">   {/*USING TAILWIND:  Border bottom and padding 6*/}
            <div><p className="flex flex-wrap "><span className="text-5xl flex flex-wrap text-theme-dream font-serif font-normal tracking-wider">DREAM</span><span className="text-5xl font-serif font-semibold tracking-wider flex flex-wrap">CATCHER</span></p></div>
            <div className="flex flex-wrap mt-4">     {/**This div to hold link, mt-4 = Margin top 4 */}
                <Link href="/" className="mr-4 text-theme-dream-2 ">
                    Home
                </Link>
                <Link href="/create-item-email" className="mr-4 text-theme-dream-2">
                    Create Parcel
                </Link>
                <div className="lg:relative lg:flex items-center mt-4 lg:mt-0 md:mt-0 lg:ml-auto md:ml-auto">
                    {/* <label for="warehouse" className="text-theme-dream-2 mr-1 font-bold">Default Warehouse:</label> */}
                    <select id="warehouse" onChange={e => updateFormInput({ ...formInput, newAcc: e.target.value })} className="block w-full px-4 py-1 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-100 mr-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value='' selected>Default Warehouse</option>
                        {
                            metamaskAcc.map((account, i) => (
                                (<option key = {i} value={`${account.metamask}, ${account.address}`}>{account.username}, {account.address}</option>)
                            ))
                        }
                    </select><br></br>
                    <button className=" flex items-center px-4 text-white bg-theme-peach rounded" type="submit" onClick = {() => replaceDefaultWarehouse()}>
                        <i className="fas fa-check mr-1"></i>
                    </button>

                    
                </div>
                
            </div>
            
            {popup ? <h1 className = "right-0 absolute pr-7 font-bold text-red-700">Changes Saved! Relog to See Changes Made!</h1> : <></> }
        </nav>
    )
}
export default ShopNavbar