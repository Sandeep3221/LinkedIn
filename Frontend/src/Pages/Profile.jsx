import React, { useContext} from 'react';
import Nav from '../Components/Nav'
import dp from '../assets/dp.webp'
import { FiPlus } from "react-icons/fi";
import { FiCamera } from "react-icons/fi";
import { HiPencil } from "react-icons/hi2";
import { userDataContex } from '../Contex/UserContex';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { authDataContex } from '../Contex/AuthContex';
import EditProfile from '../Components/EditProfile';

function Profile() {
  let {serverUrl}=useContext(authDataContex)
  let [userConnection,setUserConnection]=useState([])
  let handleGetUserConnection=async()=>{
    try {
      let result=await axios.get(`${serverUrl}api/connection`,{withCredentials:true})
      setUserConnection(result.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    handleGetUserConnection()
  },[])
  let {userData,setuserData,edit,setEdit,postdata,setPostData}=useContext(userDataContex)
  return (
    <div className='w-full min-h-[100vh] bg-[#f0efe7] flex flex-col items-center pt-[100px]'>
      <Nav/>
      {edit && <EditProfile/>}
      <div className='w-full max-w-[900px] min-h-[100vh]'>

        <div className='relative bg-white pb-[40px] rounded shadow-lg'>
          <div className='w-[100%] h-[100px] bg-gray-400 rounded overflow-hidden flex items-center justify-center cursor-pointer' onClick={()=>setEdit(true)}>
                      <img src={userData.coverImage || ""} alt="" className='w-full'/>
                      <FiCamera className='absolute right-[20px] top-[20px] w-[25px] h-[25px] text-gray-800 cursor-pointer'/>
                    </div>
                    <div className='w-[70px] h-[70px] rounded-full overflow-hidden items-center justify-center absolute top-[65px] left-[35px] cursor-pointer' onClick={()=>setEdit(true)}>
                      <img src={userData.profileImage || dp} alt="" className='h-full'/>
                    </div>
                    <div className='w-[20px] h-[20px] bg-[#17c1ff] absolute top-[105px] left-[90px] rounded-full flex justify-center items-center'> 
                        <FiPlus className='cursor-pointer text-white'/>
                    </div>
                    <div className='mt-[30px] pl-[20px] font-bold text-gray-700'>
                      <div className='text-[26px]'>{`${userData.firstName} ${userData.lastName}`}</div>
                      <div className='text-[18px] font-semibold text-gray-600'>{userData.headline || ""}</div>
                      <div className='text-[16px] text-gray-500'>{userData.location}</div>
                      <div className='text-[16px] text-gray-500'>{`${userConnection.length} connections`}</div>
                    </div>
                      <button className='min-w-[150px] h-[40px] my-[20px] ml-[20px] rounded-full border-2 border-[#2dc0ff] flex items-center justify-center gap-[10px] cursor-pointer'onClick={()=>setEdit(true)}>Edit profile <HiPencil /></button>
        </div>



      </div>
    </div>
  )
}

export default Profile