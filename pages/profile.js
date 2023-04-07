import Head from 'next/head'
import Layout from '../components/layout'
import styles from '../styles/Form.module.css'
import {HiEye, HiAtSymbol, HiOutlineUser} from "react-icons/hi"
import {useState} from 'react';
import Link from 'next/link'
import {useFormik} from 'formik'
import {registerValidate} from '../lib/validate'
import {useRouter} from 'next/router'
import ShopNavbar from '../components/ShopNavbar'

import {getSession} from 'next-auth/react'

export default function Register(){ 
    const [dataError, setDataError] = useState('')
    const [show, setShow] = useState({password:false, cpassword:false})
    const router = useRouter()
    const formik = useFormik({
        initialValues:{
            username:'',
            email:'',
            password:'',
            cpassword:'',
            role:'',
            metamask:''
        },
        validate: registerValidate, 
        onSubmit
    })


    async function onSubmit(values){
        const option = {
            method: "POST",
            headers:{'Content-Type': 'application/json'},
            body:JSON.stringify(values)
            
        }
        await fetch('http://localhost:3000/api/auth/signup', option)
            .then((res) => {
                if(res.ok){
                    router.push('http://localhost:3000/login')
                }
                else{
                    let a = Promise.resolve(res.json().then(response => setDataError(response['message'])))
                }
                })
            // .then(data => console.log(data))
            // .then(()=>{ router.push('http://localhost:3000')
            // })

    }


    return (
        <div className='font-serif h-screen w-screen'> 
        <ShopNavbar/>
        <div class="box-border mx-96 mt-8 h-4/6 border-4 rounded-md">
            <span className = "flex justify-center">Username : {}</span></div> 
        </div>
        )
}



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
    else if (session.user._doc.role == "warehouse"){
        return{
            redirect: {
              destination: '/',
              permanent:false
            }
          }
    }
    //authorize user return session
    return {
      props: {session}
    }
  }
  