/**
 * Navigation bar for user
 */
import React from 'react';
import Link from 'next/link'

function LogoNavbar() {
    return (
    <nav className="p-7 bg-gradient-to-r from-slate-100 to-theme-beige ">   {/*USING TAILWIND:  Border bottom and padding 6*/}
    <p className="flex flex-wrap "><span className="text-5xl flex flex-wrap text-theme-dream-2 font-serif font-normal tracking-wider">DREAM</span><span className="text-5xl font-serif font-semibold tracking-wider flex flex-wrap">CATCHER</span></p>

  </nav> )
}
export default LogoNavbar
