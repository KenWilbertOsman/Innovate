import connectMongo from '../../../database/conn';  
import User from '../../../model/Schema'
import { hash } from 'bcryptjs';



export default async function handler(req, res){
    // connectMongo().catch(error => res.json({ error: "Connection Failed...!"}))
    
    connectMongo()
    // // only post method is accepted
    if(req.method == 'POST'){

        if(!req.body) return res.status(404).json({ message: "Don't have form data...!"});


        const { username, email, password, role, metamask, address, city, defaultWarehouse} = req.body;

        // check duplicate users
        const checkUsername = await User.findOne({ username });
        if(checkUsername) return res.status(422).json({ message: "Username Already Exists"});
        
        const checkexisting = await User.findOne({ email });
        if(checkexisting) return res.status(422).json({ message: "User Email Already Exists"});
        
        const checkmetamask = await User.findOne({ metamask });
        if(checkmetamask) return res.status(422).json({ message: "Metamask Account Already Registered"});
        
        // hash password
        const usercreate = await User.create({username, email, password : await hash(password, 12), role, metamask, address, city, defaultWarehouse})
        
        return res.status(201).json({user: usercreate})

    } else{
        res.status(500).json({ message: "HTTP method not valid only POST Accepted"})
    }

}