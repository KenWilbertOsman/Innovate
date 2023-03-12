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

                return result;

            }
        })
    ],
    secret: "XH6bp/TkLvnUkQiPDEZNyHc0CV+VV5RL/n+HdVHoHN0=",
    session: {
        strategy: 'jwt',
    }
})