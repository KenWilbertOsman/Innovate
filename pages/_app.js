import '../styles/globals.css'

// The import link is to be able to link to other page
import Link from 'next/link'




function MyApp({ Component, pageProps }) {
  return (
    
    <div> 
    <nav className="border-b p-6">   {/*USING TAILWIND:  Border bottom and padding 6*/}
      <p className="text-4xl font-bold">Metaverse Marketplace</p>
      <div className="flex mt-4">     {/**This div to hold link, mt-4 = Margin top 4 */}
          <Link href="/" className="mr-4 text-pink-500">
              Home
          </Link>

          <Link href = "/create-item" className="mr-6 text-pink-500">
              Sell Digital Asset
          </Link>

          <Link href = "/my-assets" className = "mr-6 text-pink-500">
              My Digital Assets
          </Link>

          <Link href = "/creator-dashboard" className = "mr-6 text-pink-500">
              Creator Dashboard
          </Link>
    </div>

    </nav>
    <Component {...pageProps} /> 
    </div>
  )
}

export default MyApp
