import Head from 'next/head'
import Layout from '../components/layout'
import Link from 'next/link'
import styles from '../styles/Form.module.css'
import {HiEye, HiAtSymbol} from "react-icons/hi"
import {useState} from 'react';
import { signIn, signOut} from 'next-auth/react'
import {useFormik} from 'formik'
import loginValidate from '../lib/validate'
import {useRouter} from 'next/router'
// https://react-icons.github.io/react-icons/


export default function Login(){
    const [show, setShow] = useState(false)
    const errorLabel = {"1":"Account Doesn't Exist", "2":"Wrong Password"}
    const [errorData, setErrorData] = useState('')
    const router = useRouter()
    //formik hoook
    const formik = useFormik({
        initialValues:{
            email:'',
            password:''
        },
        validate: loginValidate,
        onSubmit //if want use different function onSubmit: ....
    })

    async function onSubmit(values){
        const status = await signIn('credentials', {
            redirect: false,
            email:values.email,
            password: values.password,
            callbackUrl: "/login",
        })
        
        if (status.ok) {
            router.push(status.url)
        }else{
            setErrorData(status.error)
        }
    }


    //Google Handler Function
    async function handleGoogleSignin(){
        signIn('google', {callbackUrl: "http://localhost:3000"})

    }
    
    return (
        <Layout>
            <Head>
                <title>Login</title>
            </Head>

            
            <section className='w-3/4 mx-auto flex flex-col gap-10'>
                <div className = "title">
                    <h1 className = "text-gray-800 text-4xl font-bold py-4"> Login </h1>
                    <p className= ' mx-auto-text-gray-400'> ..........</p>
                </div>

                {/* form */}
                <form className="flex flex-col gap-5" onSubmit={formik.handleSubmit}>
                    <div className={`${styles.input_group} ${formik.errors.email && formik.touched.email ? 'border-rose-600' : ''}`}>
                        <input 
                        className = {styles.input_text}
                        type = "email"
                        name = "email"
                        placeholder="Email"
                        {...formik.getFieldProps('email')}
                        />
                        <span className = "icon flex items-center px-4 ">
                            <HiAtSymbol size = {25}/>
                        </span>
                    </div>
                    {formik.errors.email && formik.touched.email ? <span className = "text-rose-500 flex justify-start">{formik.errors.email}</span> : <></>}
                    {errorData == "1" ? <span className = "text-rose-500 flex justify-start">{errorLabel[errorData]}</span> : <></>}
                    
                    <div className={`${styles.input_group} ${formik.errors.password && formik.touched.password ? 'border-rose-600' : ''}`}>
                        <input 
                        className = {styles.input_text}
                        type = {`${show ? "text" : "password"}`}
                        name = "password"
                        placeholder="Password"
                        {...formik.getFieldProps('password')}
                        />
                        <span className = "icon flex items-center px-4" onClick = {() => setShow(!show)}>
                            <HiEye size = {25}/>
                        </span>
                    </div>
                    {/* formik.touched.error is for the error message to appear after you have clicked on the text box and move away */}
                    {formik.errors.password && formik.touched.password? <span className = "text-rose-500 flex justify-start">{formik.errors.password}</span> : <></>}
                    {errorData == "2" ? <span className = "text-rose-500 flex justify-start">{errorLabel[errorData]}</span> : <></>}
                    
                    {/* login buttons */}
                    <div className="input-button">
                        <button type='submit' className={styles.button}>
                            Login
                        </button>
                    </div>

                    <div className="input-button">
                        <button type='button' onClick={handleGoogleSignin} className = {styles.button_custom}>
                            Sign In with Google <img src = {'/assets/google.svg'} width = "20" height = {20}></img>
                        </button>
                    </div>

                    <div className="input-button">
                        <button type='button' className={styles.button_custom}>
                        Sign In with Github <img src = {'/assets/github.svg'} width = "25" height = {25}></img>
                        </button>
                    </div>
                </form>
                {/* bottom */}
                <p className='text-center text-gray-400'>
                    Dont have an account yet? <Link className = "text-blue-700"href={'/register'}> Sign Up </Link>
                </p>
            </section>
        </Layout>

    )
}