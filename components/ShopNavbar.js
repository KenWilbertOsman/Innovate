/**
 * Navigation bar for shop owner
 */

import React from 'react';
import Link from 'next/link'
import { HiUser } from "react-icons/hi"
import { useRouter } from 'next/router';
import '@fortawesome/fontawesome-free/css/all.css';


function ShopNavbar() {
    const router = useRouter()
    return (
        <nav className="p-7 bg-gradient-to-r from-slate-100 to-theme-blue ">   {/*USING TAILWIND:  Border bottom and padding 6*/}
            <div><p className="flex flex-wrap "><span className="text-5xl flex flex-wrap text-theme-dream font-serif font-normal tracking-wider">DREAM</span><span className="text-5xl font-serif font-semibold tracking-wider flex flex-wrap">CATCHER</span></p></div>
            <div className="flex flex-wrap mt-4">     {/**This div to hold link, mt-4 = Margin top 4 */}
                <Link href="/" className="mr-4 text-theme-dream-2">
                    Home
                </Link>
                <Link href="/create-item" className="mr-4 text-theme-dream-2">
                    Create Parcel
                </Link>
                <div class="relative flex items-center mt-4 lg:mt-0 md:mt-0 lg:ml-auto md:ml-auto">
                    <label for="warehouse" class="text-theme-dream-2 mr-1">Default Warehouse:</label>
                    <select id="warehouse" class="block bg-white border border-gray-300 text-gray-700 pl-2 pr-2 mr-1 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                        <option value="1" class="py-2">Warehouse 1</option>
                        <option value="2" class="py-2">Warehouse 2</option>
                    </select>
                    <button class=" flex items-center px-4 py-1 text-white bg-theme-peach" type="submit">
                        <i class="fas fa-check mr-1"></i>
                    </button>
                </div>
            </div>
        </nav>
    )
}
export default ShopNavbar