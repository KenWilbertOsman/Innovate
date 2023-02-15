import {useEffect, useState} from 'react' //to keep with local state
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function UserTracking() {
    const [formInput, updateFormInput] = useState({hash: ''})
    const router = useRouter()

    async function userTrack() {
        const {hash} = formInput
        router.push(`/user-detail?index=${hash}`)
    }
  
    return ( 
      <div className= "flex justify-center">
        <div className="w-1/2 flex flex-col pb-12">
                <input
                    placeholder="Enter your tracking number"
                    className="mt-8 border rounded p-4"
                    onChange={e => updateFormInput({ ...formInput, hash: e.target.value })}
                />
                <button className="w-half mt-4 bg-theme-blue text-white font-bold py-2 px-11 mx-2 my-4 rounded" onClick={() => userTrack()}>Track</button>
                                    
                {/* <Link href={`/user-detail?index=${}`}  className = "mr-6 text-theme-peach">
              User Tracking Page
          </Link> */}
        </div>
        
      </div>
    )
  }
  