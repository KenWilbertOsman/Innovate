import Head from 'next/head'
import Layout from '../components/layout'
import Link from 'next/link'
import styles from '../styles/Form.module.css'

// https://react-icons.github.io/react-icons/


export default function Login(){
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
                <form className="flex flex-col gap-5">
                    <div className={styles.input_group}>
                        <input 
                        className = {styles.input_text}
                        type = "email"
                        name = "email"
                        placeholder="Email"
                        />
                    </div>
                    <div className={styles.input_group}>
                        <input 
                        className = {styles.input_text}
                        type = "password"
                        name = "password"
                        placeholder="Password"
                        />
                    </div>

                    {/* login buttons */}
                    <div className="input-button">
                        <button type='submit' className={styles.button}>
                            Login
                        </button>
                    </div>

                    <div className="input-button">
                        <button type='button' className = {styles.button_custom}>
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
                    Dont have an account yet? <Link className = "text-blue-700"href={'/register'}> Sign up</Link>
                </p>
            </section>
        </Layout>

    )
}