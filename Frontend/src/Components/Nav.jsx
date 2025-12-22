import React, { useContext, useState } from 'react'
import { IoSearchSharp } from 'react-icons/io5';
import { TiHome } from "react-icons/ti";
import { FaUserGroup } from "react-icons/fa6";
import { IoNotificationsSharp } from "react-icons/io5";
import logo2 from '../assets/logo2.png'
import dp from '../assets/dp.webp'
import { userDataContex } from '../Contex/UserContex';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Nav() {
  let [activeSearch, setActiveSearch] = useState(false)
  let { userData, setuserData } = useContext(userDataContex)
  let [showpopup, setshowPopup] = useState(null)
  let navigate = useNavigate()
  let { serverUrl } = useContext(userDataContex)

  const handleSignOut = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
      setuserData(null)
      navigate("/login")
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='w-full h-[64px] sm:h-[80px] bg-white fixed top-0 shadow-xl flex justify-between md:justify-around items-center px-[10px] left-0 z-[80]'>

      {/* LEFT */}
      <div className='flex justify-center items-center gap-[10px]'>
        <div onClick={() => { setActiveSearch(false); navigate("/") }}>
          <img src={logo2} alt="" className='w-[45px] sm:w-[50px]' />
        </div>

        {!activeSearch && (
          <div>
            <IoSearchSharp
              className='w-[23px] h-[23px] text-gray-600 lg:hidden'
              onClick={() => setActiveSearch(true)}
            />
          </div>
        )}

        <form className={`w-[160px] sm:w-[182px] lg:w-[350px] h-[40px] bg-[#f0efe7] lg:flex items-center gap-[10px] py-[5px] rounded-md ${!activeSearch ? "hidden" : "flex"}`}>
          <div>
            <IoSearchSharp className='w-[23px] h-[23px] text-gray-600' />
          </div>
          <input
            type="text"
            className='w-[80%] h-full bg-transparent outline-none border-0'
            placeholder='search users...'
          />
        </form>
      </div>

      {/* RIGHT */}
      <div className='flex justify-center items-center gap-[20px] relative'>

        {showpopup && (
          <div className='w-[260px] sm:w-[300px] min-h-[280px] bg-white shadow-lg absolute top-[65px] sm:top-[75px] right-2 rounded-lg flex flex-col items-center p-[16px] sm:p-[20px] gap-[16px] sm:gap-[20px]'>

            <div className='w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] rounded-full overflow-hidden'>
                <img
                src={userData.profileImage || dp}
                alt=""
                className="w-full h-full object-cover"
                />

            </div>

            <div className='text-[16px] sm:text-[19px] font-semibold text-gray-600'>
              {`${userData.firstName} ${userData.lastName}`}
            </div>

            <button
              className='w-full h-[36px] sm:h-[40px] rounded-full border-2 border-[#2dc0ff] cursor-pointer'
              onClick={() => navigate("/profile")}
            >
              View profile
            </button>

            <div className='w-full h-[1px] bg-gray-700'></div>

            <div
              className='flex w-full items-center justify-start text-gray-600 gap-[10px]'
              onClick={() => navigate("/network")}
            >
              <FaUserGroup className='w-[23px] h-[23px] text-gray-600' />
              <div>My Network</div>
            </div>

            <button
              className='w-full h-[36px] sm:h-[40px] rounded-full border-2 border-[#ff2d2d] text-[#ff2d2d] cursor-pointer'
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        )}

        <div className='lg:flex flex-col items-center justify-center text-gray-600 hidden'>
          <TiHome
            className='w-[23px] h-[23px] text-gray-600 cursor-pointer'
            onClick={() => navigate("/")}
          />
          <div>Home</div>
        </div>

        <div
          className='lg:flex flex-col items-center justify-center text-gray-600 hidden cursor-pointer'
          onClick={() => navigate("/network")}
        >
          <FaUserGroup className='w-[23px] h-[23px] text-gray-600' />
          <div>My Network</div>
        </div>

        <div className='flex flex-col items-center justify-center text-gray-600'>
          <IoNotificationsSharp className='w-[23px] h-[23px] text-gray-600' />
          <div className='hidden md:block'>Notification</div>
        </div>

        <div
          className='w-[36px] h-[36px] sm:w-[44px] sm:h-[44px] md:w-[50px] md:h-[50px] rounded-full overflow-hidden cursor-pointer'
          onClick={() => setshowPopup(prev => !prev)}
        >
          <img src={userData.profileImage || dp} alt="" className='w-full h-full object-cover' />
        </div>

      </div>
    </div>
  )
}

export default Nav
