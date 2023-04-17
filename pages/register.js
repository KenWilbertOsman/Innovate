import Head from 'next/head'
import Layout from '../components/layout'
import styles from '../styles/Form.module.css'
import {HiEye, HiAtSymbol, HiOutlineUser, HiLocationMarker} from "react-icons/hi"
import {useState, useEffect} from 'react';
import Link from 'next/link'
import {useFormik} from 'formik'
import {registerValidate} from '../lib/validate'
import {useRouter} from 'next/router'

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
            metamask:'',
            address:'',
            city:'',
            defaultWarehouse:''
        },
        validate: registerValidate, 
        onSubmit
    })


    async function onSubmit(values){
        if (values.role == 'admin'){
            const option = {
                method: "GET",
                headers:{'Content-Type': 'application/json'}
                    
            }
            let strings = `?q=${values.city}&filter=metamask&filter=address&find=city`
            let page = `http://localhost:3000/api/usernameRetrieve${strings}`
            const response = await fetch(page, option)
            const jsonResponse = await response.json()
            if (jsonResponse.data != null){
                let concat = `${jsonResponse.data.metamask}, ${jsonResponse.data.address}`
                values['defaultWarehouse'] = concat
            }
            
            
        }
        // console.log(values.defaultWarehouse)
        const option2 = {
            method: "POST",
            headers:{'Content-Type': 'application/json'},
            body:JSON.stringify(values)
            
        }

        await fetch('http://localhost:3000/api/auth/signup', option2)
        .then((res) => {
            if(res.ok){
                router.push('http://localhost:3000/login')
            }
            else{
                let a = Promise.resolve(res.json().then(response => setDataError(response['message'])))
            }
            })
    }

    return (
        <Layout>

        <Head> 
                <title>Register</title>
        </Head>

        <section className='w-3/4 mx-auto flex flex-col gap-10'>
                <div className = "title">
                    <h1 className = "text-gray-800 text-4xl font-bold py-4"> Register </h1>
                    
                    <p className= ' mx-auto-text-gray-400'>Please Provide All Information</p>
                    {dataError != '' ? <span className = "text-rose-500 flex justify-center text-xl">{dataError}</span> : <></>}
                    
                </div>

                {/* form */}
                <form className="flex flex-col gap-5" onSubmit={formik.handleSubmit}>
                    <div className={`${styles.input_group} ${formik.errors.username && formik.touched.username ? 'border-rose-600' : ''}`}>
                        <input 
                        className = {styles.input_text}
                        type = "text"
                        name = "Username"
                        placeholder="Full Name"
                        {...formik.getFieldProps('username')}
                        />
                        <span className = "icon flex items-center px-4 ">
                            <HiOutlineUser size = {25}/>
                        </span>
                    </div>
                    {formik.errors.username && formik.touched.username? <span className = "text-rose-500 flex justify-start">{formik.errors.username}</span> : <></>}
                    
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
                    {formik.errors.email && formik.touched.email? <span className = "text-rose-500 flex justify-start">{formik.errors.email}</span> : <></>}
                    
                    <div className={`${styles.input_group} ${formik.errors.password && formik.touched.password ? 'border-rose-600' : ''}`}>
                        <input 
                        className = {styles.input_text}
                        type = {`${show.password ? "text" : "password"}`}
                        name = "password"
                        placeholder="Password"
                        {...formik.getFieldProps('password')}
                        />
                        <span className = "icon flex items-center px-4" onClick = {() => setShow({...show, password:!show.password})}>
                            <HiEye size = {25}/>
                        </span>
                    </div>
                    {formik.errors.password && formik.touched.password? <span className = "text-rose-500 flex justify-start">{formik.errors.password}</span> : <></>}
                    
                    <div className={`${styles.input_group} ${formik.errors.cpassword && formik.touched.cpassword ? 'border-rose-600' : ''}`}>
                        <input 
                        className = {styles.input_text}
                        type = {`${show.cpassword ? "text" : "password"}`}
                        name = "cpassword"
                        placeholder="Confirm Password"
                        {...formik.getFieldProps('cpassword')}
                        />
                        <span className = "icon flex items-center px-4" onClick = {() => setShow({...show, cpassword:!show.cpassword})}>
                            <HiEye size = {25}/>
                        </span>
                    </div>
                    {formik.errors.cpassword && formik.touched.cpassword ? <span className = "text-rose-500 flex justify-start">{formik.errors.cpassword}</span> : <></>}
                    
                    <div className={`${styles.input_group} ${formik.errors.role && formik.touched.role ? 'border-rose-600' : ''}`}>
                        <select
                            id="large"
                            name="role"
                            className={styles.input_text}
                            {...formik.getFieldProps('role')}>
                            <option value="" selected>Role</option>
                            <option value="admin">Admin</option>
                            <option value="warehouse">Warehouse</option>
                            
                        </select>
                    </div>
                    {/* {formik.errors.email && formik.touched.email? <span className = "text-rose-500 flex justify-start">{formik.errors.email}</span> : <></>} */}
                    
                    <div className={`${styles.input_group} ${formik.errors.metamask && formik.touched.metamask ? 'border-rose-600' : ''}`}>
                        <input 
                        className = {styles.input_text}
                        type = "metamask"
                        name = "metamask"
                        placeholder="Metamask Account Number"
                        {...formik.getFieldProps('metamask')}
                        />
                        <span className = "icon flex items-center px-4 ">
                            <HiAtSymbol size = {25}/>
                        </span>
                    </div>
                    {formik.errors.metamask && formik.touched.metamask? <span className = "text-rose-500 flex justify-start">{formik.errors.metamask}</span> : <></>}
                    
                    <div className={`${styles.input_group} ${formik.errors.address && formik.touched.address ? 'border-rose-600' : ''}`}>
                        <input 
                        className = {styles.input_text}
                        type = "address"
                        name = "address"
                        placeholder="Address"
                        {...formik.getFieldProps('address')}
                        />
                        <span className = "icon flex items-center px-4 ">
                            <HiLocationMarker size = {25}/>
                        </span>
                    </div>
                    {formik.errors.address && formik.touched.address? <span className = "text-rose-500 flex justify-start">{formik.errors.address}</span> : <></>}
                    
                    <div className={`${styles.input_group} ${formik.errors.city && formik.touched.city ? 'border-rose-600' : ''}`}>
                        <input 
                        className = {styles.input_text}
                        type = "city"
                        name = "city"
                        placeholder="City"
                        {...formik.getFieldProps('city')}
                        />
                        <span className = "icon flex items-center px-4 ">
                            <HiLocationMarker size = {25}/>
                        </span>
                    </div>
                    {formik.errors.city && formik.touched.city? <span className = "text-rose-500 flex justify-start">{formik.errors.city}</span> : <></>}
                    
                    {/* login buttons */}
                    <div className="input-button">
                        <button type='submit' className={styles.button}>
                            Sign Up
                        </button>
                    </div>
                    </form>
                {/* bottom */}
                <p className='text-center text-gray-400 mb-3'>
                    Already Have an Account? <Link className = "text-blue-700"href={'/login'}> Login </Link>
                </p>
            </section>
        </Layout>
    )
}