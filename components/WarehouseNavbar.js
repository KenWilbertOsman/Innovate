/**
 * Navigation bar for warehouse
 */

import React from 'react';
import Link from 'next/link';
import '@fortawesome/fontawesome-free/css/all.css';

function WarehouseNavbar() {
    return (
        <nav className="p-7 bg-gradient-to-r from-slate-100 to-theme-blue ">   {/*USING TAILWIND:  Border bottom and padding 6*/}
            <p className="flex flex-wrap "><span className="text-5xl flex flex-wrap text-theme-red font-serif font-normal tracking-wider">DREAM</span><span className="text-5xl font-serif font-semibold tracking-wider flex flex-wrap">CATCHER</span></p>
            <div className="flex flex-wrap mt-4">     {/**This div to hold link, mt-4 = Margin top 4 */}
                <Link href="/" className="mr-4 text-theme-dream-2">
                    Home
                </Link>

                <Link href="/my-assets" className="mr-6 text-theme-dream-2">
                    My Digital Assets
                </Link>


                <Link href="/request-list" className="mr-6 text-theme-dream-2">
                    NFT Request List
                </Link>

                

            </div>

        </nav>)
}
export default WarehouseNavbar