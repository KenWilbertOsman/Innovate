//- _app.js => the dashboard where you can pick either create nft, check ur own collection, etc
import '../styles/globals.css'
// import Navbar from "../components/"

// The import link is to be able to link to other page
import Link from 'next/link'




function MyApp({ Component, pageProps }) {
  return (
    <Component {...pageProps} /> 
  )
}

export default MyApp
