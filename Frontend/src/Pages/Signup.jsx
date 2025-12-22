import React from 'react'
import logo from '../assets/logo.svg'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { authDataContex } from '../Contex/AuthContex'
import axios from 'axios'
import { userDataContex } from '../Contex/UserContex'
function Signup() {
let [show,setShow]=useState(false)
let {serverUrl}=useContext(authDataContex)
let {userData,setuserData}=useContext(userDataContex)
let navigate=useNavigate()
let [firstName,setFirstName]=useState("")
let [lastName,setLastName]=useState("")
let [userName,setUserName]=useState("")
let [email,setEmail]=useState("")
let [password,setPassword]=useState("")
let [loading,setLoading]=useState(false)
let [err,setErr]=useState("")

const handleSignUp=async(e)=>{
        e.preventDefault()
        setLoading(true)
        try {
                let result=await axios.post(serverUrl+"api/auth/signup",{
                        firstName,
                        lastName,
                        userName,
                        email,
                        password
                },{withCredentials:true})
                console.log(result);
                setLoading(false)
                navigate("/")
                setuserData(result.data)
                setErr("")
                setFirstName("")
                setLastName("")
                setUserName("")
                setEmail("")
                setPassword("")
        } catch (error) {
                setErr(error?.response?.data?.message);
                setLoading(false)
                console.log(error);
        }
}
return (
        <div className='w-full h-screen bg-white flex flex-col items-center justify-center'>
        <div className='w-[160px] h-[15px] p-[30px] flex items-center'>
                <img src={logo} alt="" />
        </div>
        <form className='w-[90%] max-w-[400px] h-[600px] md:shadow-xl flex flex-col justify-center  gap-[10px] p-[15px]' onSubmit={handleSignUp}>
                <h1 className='text-gray-800 text-[30px] font-bold mb-[30px]'>Sign Up</h1>
                <input type="text" placeholder='firstname' required className='w-full h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md' value={firstName} onChange={(e)=>setFirstName(e.target.value)}/>
                <input type="text" placeholder='lastname' required className='w-full h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md' value={lastName}  onChange={(e)=>setLastName(e.target.value)}/>
                <input type="text" placeholder='userName' required className='w-full h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md' value={userName}  onChange={(e)=>setUserName(e.target.value)}/>
                <input type="email" placeholder='email' required className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <div className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] rounded-md relative'>
                        <input type={show?"text":"password"} placeholder='Password' required className='w-full h-full border-none border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                        <span className='absolute right-[20px] top-[10px] text-[#1dc9fd] font-semibold cursor-pointer' onClick={()=>setShow(prev=>!prev)}>{show?"hide":"show"}</span>
                </div>
                {err && <p className='text-center text-red-500'>*{err}</p>}
                <button className='w-full h-[50px] rounded-full bg-[#1dc9fd] text-white mt-[40px]' disabled={loading}>{loading?"Loading":"Sign Up"}</button>
                <p className='text-center' onClick={()=>navigate("/login")}>Already have an account? <span className='text-[#1d89fd] cursor-pointer'>Login In</span></p>
        </form>
    </div>
  )
}

export default Signup