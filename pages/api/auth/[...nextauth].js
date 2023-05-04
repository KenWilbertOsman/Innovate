//This is file is for the credentials login, in this case, there are google signin credentials and 
//also using email and password from mongodb

import NextAuth from 'next-auth';
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from 'next-auth/providers/credentials';
import connectMongo from '../../../database/conn'
import Users from '../../../model/Schema'
import { compare } from 'bcryptjs';


export default NextAuth({
    providers : [
        // Google Provider
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        }),
        CredentialsProvider({
            name : "Credentials",
            async authorize(credentials, req){
                connectMongo().catch(error => { error: "Connection Failed...!"})

                // check user existance
                const result = await Users.findOne( { email : credentials.email})
                
                if(!result){
                    throw new Error("1")
                }

                // compare()
                const checkPassword = await compare(credentials.password, result.password);
                
                // incorrect password
                if(!checkPassword || result.email !== credentials.email){
                    throw new Error("2");
                }

                // result = 
                // {
                //     _id: new ObjectId("640dde57cc9322ac68bd4297"),
                //     email: 'ken@gmail.com',
                //     password: '$2a$12$VxQlJbzTh9un6xtx4lzAhOAWJtcpOogYkZcEd/43fEQt6hn09mDCS',
                //     username: 'kenn',
                //     role: 'admin',
                //     metamask: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
                //     __v: 0
                //   }
                return result;

            }
        })
    ],
    secret: process.env.NEXT_AUTH_SECRET,
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async jwt({token, user}){
            // console.log ({...token, ...user})
            return {...token, ...user}
        },
        async session({session, token}){
            session.user = token
            return session
        }
    }
})