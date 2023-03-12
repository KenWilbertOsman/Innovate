import connectMongo from '../../../database/conn';  
import User from '../../../model/Schema'
import { hash } from 'bcryptjs';



export default async function handler(req, res){
    // connectMongo().catch(error => res.json({ error: "Connection Failed...!"}))
    
    connectMongo()
    // // only post method is accepted
    if(req.method == 'POST'){

        if(!req.body) return res.status(404).json({ error: "Don't have form data...!"});
        const { username, email, password } = req.body;

        // check duplicate users
        const checkexisting = await User.findOne({ email });
        if(checkexisting) return res.status(422).json({ message: "User Already Exists...!"});
        
        // hash password
        await User.create({username, email, password : await hash(password, 12)})
        return res.status(201).json({status:true})

    } else{
        res.status(500).json({ message: "HTTP method not valid only POST Accepted"})
    }

}