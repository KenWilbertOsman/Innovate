//This file is to replace default warehouse (for admin (shop owner) only)
import connectMongo from '../../database/conn'
import User from '../../model/Schema'

export default async function handler(req, res) {
    connectMongo().catch(error => { error: "Connection Failed...!"})
    const {username, newAcc} = req.body
    // if using `NEXTAUTH_SECRET` env variable, we detect it, and you won't actually need to `secret`
    const accounts = await User.findOneAndUpdate({ username:username }, { defaultWarehouse: newAcc });
    if (!accounts) return res.status(404).json({message:"No Warehouse Registered"})

    return res.json({data:accounts})
  }