//This file is to establish the connection to mongodb

import mongoose from 'mongoose';

//this is to connect to mongo
// const connectMongo = async () => {
//     try {
//         const connection  = await mongoose.connect(process.env.MONGO_URL);

//         if(connection.readyState == 1){
//             return Promise.resolve(true)
//         }
//     } catch (error) {
//         return Promise.reject(error)
//     }
// }

const connection = {}

async function connectMongo(){
    if(connection.isConnected){
        return "connected"
    }

    const db = await mongoose.connect(process.env.MONGO_URL)

    connection.isConnected = db.connections[0].readyState;
}

export default connectMongo;