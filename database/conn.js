/**
 * This file is to establish the connection to mongodb
*/
import mongoose from 'mongoose';


const connection = {}

async function connectMongo(){
    if(connection.isConnected){
        return "connected"
    }

    const db = await mongoose.connect(process.env.MONGO_URL)

    connection.isConnected = db.connections[0].readyState;
}

export default connectMongo;