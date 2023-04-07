import React from 'react';
import Link from 'next/link'
import {HiUser} from "react-icons/hi"
import {useRouter} from 'next/router'


function ShopNavbar() {
    const router = useRouter()
    return (
    <nav className="p-7 bg-gradient-to-r from-slate-100 to-amber-500 ">   {/*USING TAILWIND:  Border bottom and padding 6*/}
    
     <div><p class="flex flex-wrap "><span className="text-5xl flex flex-wrap text-theme-beige font-serif font-normal tracking-wider">DREAM</span><span className="text-5xl font-serif font-semibold tracking-wider flex flex-wrap">CATCHER</span></p></div>
    <div className="flex flex-wrap mt-4">     {/**This div to hold link, mt-4 = Margin top 4 */}
        <Link href="/" className="mr-4 text-theme-peach">
            Home
        </Link>
        <Link href="/create-item" className="mr-4 text-theme-peach">
            Create Parcel
        </Link>

        
    </div>
    <span className = "top-0 right-0 absolute pr-6 pt-10" onClick = {() => router.push('/profile')}>
                            <HiUser size = {45} color = "808080"/>
    </span>
  </nav> 
  )
}
export default ShopNavbar