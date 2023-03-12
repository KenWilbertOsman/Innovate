import {Schema, model, models} from 'mongoose'

const userSchema = new Schema({
    username:String,
    email:String,
    password:String
})

//models.user is if you already have existing model so we don't keep creating new model
//this is to create new model inside mongodb and specify the structure
module.exports = models.user || model('user', userSchema)


// export default Users;
 

// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     email:{
//         type:String,
//         required:true,
//         unique:true
//     },
//     password:{
//         type:String,
//         required:true
//     }
// })

// module.exports = mongoose.models.User || mongoose.model('User',userSchema)