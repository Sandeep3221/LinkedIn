import { useContext, useState } from 'react'
import { createContext } from 'react'
import { authDataContex } from './AuthContex'
import axios from 'axios'
import { useEffect } from 'react'
export const userDataContex=createContext()
function UserContex({children}) {
let [userData,setuserData]=useState(null)
const [loading, setLoading] = useState(true);
let {serverUrl}=useContext(authDataContex)
let [edit,setEdit]=useState(false)
let [postdata,setPostData]=useState([])

let getCurrentUser=async()=>{
        try {
                let result=await axios.get(serverUrl+"api/user/currentuser",{
                        withCredentials:true
                })
                setuserData(result.data)
        } catch (error) {
                setuserData(null);
                console.log(error)
        }finally{
                setLoading(false);
        }
}
const getPost=async ()=>{
        try {
                let result=await axios.get(serverUrl+"api/post/getpost",{withCredentials:true})
                console.log(result)
                setPostData(result.data)
        } catch (error) {
                console.log(error)
        }
}
useEffect(()=>{
        getCurrentUser()
        getPost()
},[])
        const value={
                userData,setuserData,edit,setEdit,postdata,setPostData,getPost
        }
        if (loading) return <div>Loading...</div>;
  return (
        <userDataContex.Provider value={value}>
        {children}
        </userDataContex.Provider>
  )
}

export default UserContex;