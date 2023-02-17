//- _app.js => the dashboard where you can pick either create nft, check ur own collection, etc
import '../styles/globals.css'

// The import link is to be able to link to other page
import Link from 'next/link'




function MyApp({ Component, pageProps }) {
  return (
    
    <div className='font-serif'> 
    <nav className="border-b p-7 bg-gradient-to-r from-slate-100 to-amber-500">   {/*USING TAILWIND:  Border bottom and padding 6*/}
      <p><span className="text-5xl text-theme-beige font-serif font-normal tracking-wider">DREAM</span><span className="text-5xl font-serif font-semibold tracking-wider">CATCHER</span></p>
      <div className="flex mt-4">     {/**This div to hold link, mt-4 = Margin top 4 */}
          <Link href="/" className="mr-4 text-theme-peach">
              Home
          </Link>

          <Link href = "/create-item" className="mr-6 text-theme-peach">
              Sell Digital Asset
          </Link>

          <Link href = "/my-assets" className = "mr-6 text-theme-peach">
              My Digital Assets
          </Link>


          <Link href = "/request-list" className = "mr-6 text-theme-peach">
              NFT Request List
          </Link>

          <Link href = "/database" className = "mr-6 text-theme-peach">
              Database
          </Link>

          <Link href = "/user-tracking" className = "mr-6 text-theme-peach">
              User Tracking Page
          </Link>

    </div>

    </nav>
    <Component {...pageProps} /> 
    </div>
  )
}

export default MyApp
