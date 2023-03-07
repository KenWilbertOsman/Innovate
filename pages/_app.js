//- _app.js => the dashboard where you can pick either create nft, check ur own collection, etc
import '../styles/globals.css'
import {SessionProvider} from 'next-auth/react'

function MyApp({ Component, pageProps}) {
  return (
    <SessionProvider session={pageProps.session}> 
      <Component {...pageProps} /> 
    </SessionProvider>
    
  )
}

export default MyApp
