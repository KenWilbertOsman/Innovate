import User from '../../../model/Schema'

export default async function handler(req, res) {
    // if using `NEXTAUTH_SECRET` env variable, we detect it, and you won't actually need to `secret`
    // const token = await getToken({ req })
    const accounts = await User.find({role:"warehouse"} ,'username metamask').exec()
    if (!accounts) return res.status(404).json({message:"No Warehouse Registered"})

    // console.log("Accounts", accounts)
    return res.json({data:accounts})
  }