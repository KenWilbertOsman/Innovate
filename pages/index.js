
import Head from 'next/head'
import Link from 'next/link'
import {getSession, useSession, signOut} from 'next-auth/react'
import AdminNavbar from "../components/AdminNavbar"  
import WarehouseNavbar from "../components/WarehouseNavbar"  
import ShopNavbar from "../components/ShopNavbar"  


//default function for this file
export default function Home() {
  const {data:session} = useSession()

    function handleSignOut(){
      signOut()
    }

  return (
    <div > 
      
    {NavigationBar(session)}

    {session? User({session, handleSignOut}) : Guest()}
    
    </div>
  )
}
function NavigationBar(session)
{
  if (session.user._doc.role == "warehouse"){
    return <WarehouseNavbar/>
  }
  else if (session.user.email.includes("@dreamcatcher.com")){
    return <AdminNavbar/>
  }
  else if (session.user._doc.role == "admin") {
    return <ShopNavbar/>
  }
  

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
  let defaultWarehouse = session.user._doc.defaultWarehouse
  let address
  let role
  if (session.user._doc.role == 'admin'){
    role = "Admin"
    if (defaultWarehouse != ''){
      address = `${defaultWarehouse.split(",").slice(1)}`
    }
    else{
      address = "None"
    }
  } 
  else{
    role= "Warehouse"
    address = ''
  }

  return(
    <div className="container mx-auto text-center py-20">
      <h3 className = "text-4xl font-bold">
        Authorized User Homepage
      </h3>

      <div className = 'details'>
        <h5><span className="font-bold">Role: </span> {role} </h5>
        <h5><span className="font-bold">Default Warehouse to be Delivered: </span>{address}</h5>
        <h5><span className="font-bold">Email Account: </span>{session.user.email}</h5>
      </div>
    <br></br>
      <div>
        <h5 className="text-theme-red">Relog in to see changes made for default warehouse</h5>
      </div>
      <div className = 'flex justify-center'>
        <button className = "mt-5 px-10 py-1 rounded-sm bg-theme-blue text-gray-50" onClick={handleSignOut}>Sign Out</button>
      </div>

      {/* <div className="flex justify-center">
        <Link className="mt-5 px-10 py-1 rounded-sm bg-indigo-500 text-gray-50" href={'/profile'}>Profile Page</Link>

      </div> */}
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
