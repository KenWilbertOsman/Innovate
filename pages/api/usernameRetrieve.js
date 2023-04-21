//This file is to retrieve information from mongodb for different usage
import connectMongo from '../../database/conn'
import User from '../../model/Schema'

export default async function handler(req, res) {
    connectMongo().catch(error => { error: "Connection Failed...!"})
    const {q, filter, find} = req.query //take the variable from the query

    let accounts
    if (find == 'metamask') {
      accounts = await User.find({metamask: q} , filter).exec()
      if (!accounts) return res.status(404).json({message:"No Warehouse Registered"})
    }
    else if (find == 'city') {
      accounts = await User.findOne({city: q, role: 'warehouse'} , filter).exec()
      if (!accounts) return res.json({data:accounts}) 
    }
    // console.log(req.query)
    return res.json({data: accounts})
  }

