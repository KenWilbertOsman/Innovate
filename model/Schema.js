import {Schema, model, models} from "mongoose";

const userSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    },
    metamask:{
        type:String,
        required:true
    }
})

module.exports = models.User || model('User',userSchema)