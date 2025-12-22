import React, { useContext, useRef } from 'react'
import { RxCross1 } from 'react-icons/rx';
import { FiPlus } from "react-icons/fi";
import { FiCamera } from "react-icons/fi";
import { userDataContex } from '../Contex/UserContex';
import dp from '../assets/dp.webp'
import { useState } from 'react';
import axios from 'axios';
import { authDataContex } from '../Contex/AuthContex';
function EditProfile() {
  let {edit,setEdit,userData,setuserData}=useContext(userDataContex)
  let {serverUrl}=useContext(authDataContex)
  let [firstName,setFirstName]=useState(userData.firstName || "")
  let [lastName,setLastName]=useState(userData.lastName || "")
  let [userName,setUserName]=useState(userData.userName || "")
  let [headline,setHeadline]=useState(userData.headline || "")
  let [location,setLocation]=useState(userData.location || "")
  let [gender,setGender]=useState(userData.gender || "")
  let [skills,setSkills]=useState(userData.skills || [])
  let [newSkills,setNewSkills]=useState("")
  let [education,setEducation]=useState(userData.education || [])
  let [newEducation,setNewEducation]=useState({
    college:"",
    degree:"",
    fieldOfStudy:""
  })
  function addSkill(e){
    e.preventDefault()
    if(newSkills && !skills.includes(newSkills)){
      setSkills([...skills,newSkills])
    }
    setNewSkills("")
  }
  function removeSkill(skill){
    if(skills.includes(skill)){
      setSkills(skills.filter((s)=>s!==skill))
    }
  }
  function addEducation(e){
    e.preventDefault()
    if(newEducation.college && newEducation.degree && newEducation.fieldOfStudy){
      setEducation([...education,newEducation])
    }
    setNewEducation({
      college:"",
      degree:"",
      fieldOfStudy:""
    })
  }
  function removeEducation(edu){
    if(education.includes(edu)){
      setEducation(education.filter((e)=>e!==edu))
    }
  }
  function handleProfileImage(e){
    let file=e.target.files[0]
    setBackendProfileImage(file)
    setFrontendProfileImage(URL.createObjectURL(file))
  }
  function handleCoverImage(e){
    let file=e.target.files[0]
    setBackendCoverImage(file)
    setFrontendCoverImage(URL.createObjectURL(file))
  }
let [frontendProfileImage,setFrontendProfileImage]=useState(userData.profileImage || dp)
let [backendProfileImage,setBackendProfileImage]=useState(null)
let [frontendCoverImage,setFrontendCoverImage]=useState(userData.coverImage || null)
let [backendCoverImage,setBackendCoverImage]=useState(null)
let [saving,setSaving]=useState(false)
const profileImage=useRef()
const coverImage=useRef()
const handleSaveProfile=async ()=>{
  setSaving(true)
  try {
    let formdata=new FormData()
    formdata.append("firstName",firstName)
    formdata.append("lastName",lastName)
    formdata.append("userName",userName)
    formdata.append("headline",headline)
    formdata.append("location",location)
    formdata.append("skills",JSON.stringify(skills))
    formdata.append("education",JSON.stringify(education))
    if(backendProfileImage){
      formdata.append("profileImage",backendProfileImage)
    }
    if(backendCoverImage){
      formdata.append("coverImage",backendCoverImage)
    }
    let result=await axios.put(serverUrl+"api/user/updateprofile",formdata,{withCredentials:true})
    setuserData(result.data)
    setSaving(false)
    setEdit(false)
  } catch (error) {
    console.log(error)
    setSaving(false)
  }
}
  return (
<div className='w-full h-[100vh] fixed top-0 z-[100] flex justify-center items-center'>
      <input type="file" accept='image/*' hidden ref={profileImage} onChange={handleProfileImage}/>
      <input type="file" accept='image/*' hidden ref={coverImage} onChange={handleCoverImage}/>
        <div className='w-full h-full  bg-black opacity-[0.5] absolute'></div>
        <div className='w-[90%] max-w-[500px] h-[600px] bg-white relative overflow-auto z-[200] shadow-lg rounded-lg p-[20px]'>
        <div className='absolute top-[20px] right-[20px]'><RxCross1 className=' w-[25px] h-[25px] text-gray-800 font-bold cursor-pointer'  onClick={()=>setEdit(false)}/></div>
        <div className='w-full h-[150px] bg-gray-500 rounded-lg mt-[40px] overflow-hidden' onClick={()=>coverImage.current.click()}>
        <img src={frontendCoverImage} alt="" className='w-full'/>
        <FiCamera className='absolute right-[28px] top-[70px] w-[25px] h-[25px] text-gray-800 cursor-pointer'/>
        </div>
        <div className='w-[80px] h-[80px] rounded-full overflow-hidden absolute top-[150px] ml-[20px] cursor-pointer'>
          <img src={frontendProfileImage} alt="" className='w-full h-full' onClick={()=>profileImage.current.click()}/>
        </div>
        <div className='w-[20px] h-[20px] bg-[#17c1ff] absolute top-[198px] left-[105px] rounded-full flex justify-center items-center'> 
        <FiPlus className='cursor-pointer text-white'/>
        </div>
        <div className='w-full flex flex-col items-center justify-center gap-[20px] mt-[50px]'>
          <input type="text" placeholder='firstName' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg' value={firstName} onChange={(e)=>setFirstName(e.target.value)}/>
          <input type="text" placeholder='lastName' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg' value={lastName} onChange={(e)=>setLastName(e.target.value)}/>
          <input type="text" placeholder='userName' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg' value={userName} onChange={(e)=>setUserName(e.target.value)}/>
          <input type="text" placeholder='headline' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg' value={headline} onChange={(e)=>setHeadline(e.target.value)}/>
          <input type="text" placeholder='location' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg' value={location} onChange={(e)=>setLocation(e.target.value)}/>
          <input type="text" placeholder='gender (male/female/others)' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg' value={gender} onChange={(e)=>setGender(e.target.value)}/>
          <div className='w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg'>
            <h1 className='text-[19px] font-semibold'>Skills</h1>
            {skills && <div className='flex flex-col gap-[10px]'>{
              skills.map((skill,index)=>(
                <div key={index} className='w-full h-[40px] border-[1px] border-gray-600 bg-gray-200 rounded-lg p-[10px] flex justify-between items-center'><span>{skill}</span> <RxCross1 className=' w-[20px] h-[20px] text-gray-800 font-bold cursor-pointer' onClick={()=>removeSkill(skill)}></RxCross1></div>
              ))}</div>}
              <form className='flex  flex-col gap-[10px] items-start'>
                <input type="text" placeholder='add new Skill' value={newSkills} onChange={(e)=>setNewSkills(e.target.value)} className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg'/>
                <button className='w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]' onClick={addSkill}>Add</button>
              </form>
          </div>
          <div className='w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg'>
            <h1 className='text-[19px] font-semibold'>Education</h1>
            {education && <div className='flex flex-col gap-[10px]'>{
              education.map((edu,index)=>(
                <div key={index} className='w-full border-[1px] border-gray-600 bg-gray-200 rounded-lg p-[10px] flex justify-between items-center'>
                  <div>
                  <div>College {edu.college}</div>
                  <div>Degree {edu.degree}</div>
                  <div>Field of Study {edu.fieldOfStudy}</div>
                  </div> <RxCross1 className=' w-[20px] h-[20px] text-gray-800 font-bold cursor-pointer' onClick={()=>removeEducation(edu)}></RxCross1></div>
              ))}</div>}
              <form className='flex  flex-col gap-[10px] items-start'>
                <input type="text" placeholder='college' value={newEducation.college} onChange={(e)=>setNewEducation({...newEducation,college:e.target.value})} className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg'/>
                <input type="text" placeholder='degree' value={newEducation.degree} onChange={(e)=>setNewEducation({...newEducation,degree:e.target.value})} className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg'/>
                <input type="text" placeholder='field of study' value={newEducation.fieldOfStudy} onChange={(e)=>setNewEducation({...newEducation,fieldOfStudy:e.target.value})} className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg'/>
                <button className='w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]' onClick={addEducation}>Add</button>
              </form>
          </div>
          <button className='w-[100%] h-[50px] rounded-full bg-[#24b2ff] mt-[40px] text-white cursor-pointer' disabled={saving} onClick={()=>handleSaveProfile()}>{saving?"Saving...":"Save Profile"}</button>
        </div>
        </div>
    </div>
)
}

export default EditProfile