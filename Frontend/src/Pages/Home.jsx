import React, { useContext,useEffect,useRef} from 'react';
import axios from "axios";
import Nav from '../Components/Nav'
import dp from '../assets/dp.webp'
import { RxCross1 } from 'react-icons/rx';
import { FiPlus } from "react-icons/fi";
import { FiCamera } from "react-icons/fi";
import { BsImage } from "react-icons/bs";
import { HiPencil } from "react-icons/hi2";
import { userDataContex } from '../Contex/UserContex';
import EditProfile from '../Components/EditProfile';
import { useState } from 'react';
import { authDataContex } from '../Contex/AuthContex';
import Post from '../Components/Post';

function Home() {
  let {userData,setuserData,edit,setEdit,postdata,setPostData}=useContext(userDataContex)
  let [frontendImage,setFrontendImage]=useState("")
  let [backendImage,setBackendImage]=useState("")
  let [description,setDescription]=useState("")
  let [uploadPost,setUploadPost]=useState(false)
  let {serverUrl}=useContext(authDataContex)
  let [posting,setPosting]=useState(false)
  let [suggestedUsers,setSuggestedUsers]=useState([])
  let image=useRef()

  function handleImage(e){
    let file=e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  async function handleUploadPost(){
    setPosting(true)
    try {
      let formdata=new FormData()
      formdata.append("description",description)
      if(backendImage){
        formdata.append("image",backendImage)
      }
      let result=await axios.post(serverUrl+"api/post/create",formdata,{withCredentials:true})
      setPosting(false)
      setUploadPost(false)
    } catch (error) {
      setPosting(false)
      console.log(error)
    }
  }

  const handleSuggestedUsers=async()=>{
    try {
      let result=await axios.get(serverUrl+"api/user/suggestedusers",{withCredentials:true})
      setSuggestedUsers(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    handleSuggestedUsers()
  },[])

  return (
    <div className='w-full h-auto bg-[#f3f2ec] pt-[90px] flex justify-center px-[10px] md:px-[20px]'>
      {edit && <EditProfile/>}
      <Nav/>

      <div className='w-full max-w-[1400px] flex flex-col lg:flex-row gap-[20px]'>

        {/* LEFT PROFILE */}
        <div className='w-full lg:w-[25%] bg-white shadow-lg rounded-lg p-[15px] relative self-start'>
          <div className='w-full h-[110px] bg-gray-300 rounded-lg overflow-hidden cursor-pointer' onClick={()=>setEdit(true)}>
            <img src={userData.coverImage || ""} alt="" className='w-full h-full object-cover'/>
            <FiCamera className='absolute right-[15px] top-[15px] w-[22px] h-[22px]'/>
          </div>

          <div className='w-[75px] h-[75px] rounded-full overflow-hidden absolute top-[80px] left-[20px] cursor-pointer' onClick={()=>setEdit(true)}>
            <img src={userData.profileImage || dp} alt="" className='w-full h-full object-cover'/>
          </div>

          <div className='w-[22px] h-[22px] bg-[#17c1ff] absolute top-[120px] left-[75px] rounded-full flex items-center justify-center'>
            <FiPlus className='text-white'/>
          </div>

          <div className='mt-[45px] pl-[10px]'>
            <div className='text-[20px] font-semibold'>{`${userData.firstName} ${userData.lastName}`}</div>
            <div className='text-[16px] text-gray-600'>{userData.headline || ""}</div>
            <div className='text-[14px] text-gray-500'>{userData.location}</div>
          </div>

          <button
            className='w-full h-[40px] mt-[15px] rounded-full border-2 border-[#2dc0ff] flex items-center justify-center gap-[8px] cursor-pointer'
            onClick={()=>setEdit(true)}
          >
            Edit profile <HiPencil />
          </button>
        </div>

        {/* CENTER FEED */}
        <div className='w-full lg:w-[50%] flex flex-col gap-[20px]'>
          <div className='w-full bg-white shadow-lg rounded-lg p-[15px] flex items-center gap-[10px]'>
            <div className='w-[55px] h-[55px] rounded-full overflow-hidden'>
              <img src={userData.profileImage || dp} alt="" className='w-full h-full object-cover'/>
            </div>
            <button
              className='flex-1 h-[50px] rounded-full border-2 border-gray-400 px-[20px] text-left hover:bg-gray-200'
              onClick={()=>setUploadPost(true)}
            >
              Start a post
            </button>
          </div>

          {postdata.map((post,index)=>(
            <Post
              key={index}
              id={post._id}
              description={post.description}
              author={post.author}
              image={post.image}
              like={post.like}
              comment={post.comment}
              createdAt={post.createdAt}
            />
          ))}
        </div>

        {/* RIGHT SUGGESTED USERS */}
        <div className='hidden lg:block w-[25%] bg-white shadow-lg rounded-lg p-[15px] self-start'>
          <h1 className='text-[18px] font-semibold text-gray-700 mb-[10px]'>Suggested Users</h1>

          {suggestedUsers.length > 0 ? (
            <div className='flex flex-col gap-[10px]'>
              {suggestedUsers.map((su)=>(
                <div key={su._id} className='flex items-center gap-[10px] p-[8px] rounded-lg hover:bg-gray-200 cursor-pointer'>
                  <div className='w-[40px] h-[40px] rounded-full overflow-hidden'>
                    <img src={su.profileImage || dp} alt="" className='w-full h-full object-cover'/>
                  </div>
                  <div>
                    <div className='text-[15px] font-semibold'>{`${su.firstName} ${su.lastName}`}</div>
                    <div className='text-[12px] text-gray-600'>{su.headline}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>No Suggested Users</div>
          )}
        </div>

      </div>

      {/* POST MODAL */}
      {uploadPost && <div className='fixed inset-0 bg-black opacity-60 z-[100]'></div>}

      {uploadPost && (
        <div className='fixed z-[200] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-[500px] bg-white rounded-lg p-[20px] flex flex-col gap-[15px]'>
          <RxCross1 className='absolute top-[15px] right-[15px] cursor-pointer' onClick={()=>setUploadPost(false)}/>

          <div className='flex items-center gap-[10px]'>
            <div className='w-[55px] h-[55px] rounded-full overflow-hidden'>
              <img src={userData.profileImage || dp} alt="" className='w-full h-full object-cover'/>
            </div>
            <div className='text-[18px]'>{`${userData.firstName} ${userData.lastName}`}</div>
          </div>

          <textarea
            className={`w-full ${frontendImage ? "h-[150px]" : "h-[300px]"} outline-none resize-none`}
            placeholder='What do you want to talk about...?'
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
          />

          {frontendImage && (
            <div className='w-full h-[250px] overflow-hidden rounded-lg'>
              <img src={frontendImage} alt="" className='w-full h-full object-cover'/>
            </div>
          )}

          <input type="file" ref={image} hidden onChange={handleImage}/>
          <div className='flex justify-between items-center'>
            <BsImage className='w-[22px] h-[22px] cursor-pointer' onClick={()=>image.current.click()}/>
            <button
              className='w-[100px] h-[40px] rounded-full bg-[#24b2ff] text-white'
              disabled={posting}
              onClick={handleUploadPost}
            >
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default Home
