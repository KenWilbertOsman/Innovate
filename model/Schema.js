
/**
 * This file is to create a model to store into the mongodb
 * In this case, username, email, passwrod, role, metamask will be stored in metamask database
*/

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
    },
    address:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    defaultWarehouse:{
        type:String
    }
})

//to check if there is existing model or create a new one
module.exports = models.User || model('User',userSchema)