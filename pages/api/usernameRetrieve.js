//This file is to retrieve information from mongodb that has role of warehouse
import connectMongo from '../../database/conn'
import User from '../../model/Schema'

export default async function handler(req, res) {
    connectMongo().catch(error => { error: "Connection Failed...!"})
    const {metamaskAcc, filter} = req.query
    // if using `NEXTAUTH_SECRET` env variable, we detect it, and you won't actually need to `secret`
    const accounts = await User.find({metamask: metamaskAcc} , filter).exec()
    if (!accounts) return res.status(404).json({message:"No Warehouse Registered"})
    // console.log(req.query)
    return res.json({data: accounts})
  }
