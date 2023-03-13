import LogoNavbar from "../components/LogoNavbar"  
import Head from 'next/head'
import Link from 'next/link'
import {getSession, useSession, signOut} from 'next-auth/react'


//default function for this file
export default function Home() {
  const {data:session} = useSession()

    function handleSignOut(){
      signOut()
    }

  return (
    <div > 
    <LogoNavbar/>
    <Head>
      <title>Home Page</title>
    </Head>

    {session? User({session, handleSignOut}) : Guest()}
    
    </div>
  )
}

//Guest
function Guest(){
  return(
    <div className="container mx-auto text-center py-20">
      <h3 className = "text-4xl font-bold">
        Guest Homepage
      </h3>
      <div className="flex justify-center">
        <Link className="mt-5 px-10 py-1 rounded-sm bg-indigo-500 text-gray-50" href={'/login'}>Sign In</Link>

      </div>
    </div>
  )
}

//Authorize User
function User({session, handleSignOut}){
  return(
    <div className="container mx-auto text-center py-20">
      <h3 className = "text-4xl font-bold">
        Authorized User Homepage
      </h3>

      <div className = 'details'>
        <h5>Role: {session.user._doc.role}</h5>
        <h5>{session.user.email}</h5>
      </div>

      <div className = 'flex justify-center'>
        <button className = "mt-5 px-10 py-1 rounded-sm bg-indigo-500 text-gray-50" onClick={handleSignOut}>Sign Out</button>
      </div>

      <div className="flex justify-center">
        <Link className="mt-5 px-10 py-1 rounded-sm bg-indigo-500 text-gray-50" href={'/profile'}>Profile Page</Link>

      </div>
    </div>
  )
}

//protected route
//this function is to generate this page only when the session is in the cookie


export async function getServerSideProps({req}){
  const session = await getSession({req})

  //if session is not authorised
  if(!session){
    return{
      redirect: {
        destination: '/login',
        permanent:false
      }
    }
  }
  //authorize user return session
  return {
    props: {session}
  }
}
