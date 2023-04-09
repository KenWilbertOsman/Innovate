/**
 * Navigation bar for admin
 */
import React from 'react';
import Link from 'next/link'

function AdminNavbar() {
    return (
    <nav className="p-7 bg-gradient-to-r from-slate-100 to-amber-500 ">   {/*USING TAILWIND:  Border bottom and padding 6*/}
    <p className="flex flex-wrap "><span className="text-5xl flex flex-wrap text-theme-beige font-serif font-normal tracking-wider">DREAM</span><span className="text-5xl font-serif font-semibold tracking-wider flex flex-wrap">CATCHER</span></p>
    <div className="flex flex-wrap mt-4">     {/**This div to hold link, mt-4 = Margin top 4 */}
        <Link href="/" className="mr-4 text-theme-peach">
            Home
        </Link>

        <Link href="/database" className="mr-4 text-theme-peach">
            Database
        </Link>
    </div>
  </nav> )
}
export default AdminNavbar