//just for testing printing token jwt
import { getToken } from "next-auth/jwt"

const secret = "XH6bp/TkLvnUkQiPDEZNyHc0CV+VV5RL/n+HdVHoHN0="

export default async function handler(req, res) {
  // if using `NEXTAUTH_SECRET` env variable, we detect it, and you won't actually need to `secret`
  // const token = await getToken({ req })
  const token = await getToken({ req, secret })
  console.log("JSON Web Token", token)
//   res.end()
  return res.json({data:token})
}