import React, { useState, useContext, useEffect } from 'react'
import dp from '../assets/dp.webp'
import moment from "moment"
import axios from 'axios'
import { BiLike } from "react-icons/bi"
import { FaRegCommentDots } from 'react-icons/fa'
import { authDataContex } from '../Contex/AuthContex'
import { userDataContex } from '../Contex/UserContex'
import { LuSendHorizontal } from "react-icons/lu";
import { io } from 'socket.io-client'
import ConnectionButton from './ConnectionButton'

let socket = io("http://localhost:8000")

function Post({ id, author, like, comment, description, image, createdAt }) {

  let [more, setMore] = useState(false)
  let [likes, setLikes] = useState(like || [])
  let [commentContent, setCommentContent] = useState("")
  let [comments, setComments] = useState(comment || [])
  let [showComment, setShowComment] = useState(false)

  let { serverUrl } = useContext(authDataContex)
  let { userData, getPost } = useContext(userDataContex)

  const Like = async () => {
    try {
      let result = await axios.get(
        serverUrl + `api/post/like/${id}`,
        { withCredentials: true }
      )
      setLikes(result.data.like)
    } catch (error) {
      console.log(error)
    }
  }

  const Comment = async (e) => {
    e.preventDefault()
    try {
      let result = await axios.post(
        serverUrl + `api/post/comment/${id}`,
        { content: commentContent },
        { withCredentials: true }
      )
      setComments(result.data.comment)
      setCommentContent("")
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    socket.on("likeUpdated", ({ postId, likes }) => {
      if (postId === id) setLikes(likes)
    })

    socket.on("commentAdded", ({ postId, comm }) => {
      if (postId === id) setComments(comm)
    })

    return () => {
      socket.off("likeUpdated")
      socket.off("commentAdded")
    }
  }, [id])

  useEffect(() => {
    getPost()
  }, [likes, comments])

  return (
    <div className='w-full bg-white flex flex-col gap-3 rounded-lg shadow-lg p-4 sm:p-5'>

      {/* ================= HEADER ================= */}
      {/* Mobile: stack vertically | Desktop: row */}
      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3'>

        {/* Profile info */}
        <div className='flex items-start gap-3'>
          {/* Smaller dp on mobile */}
          <div className='w-[55px] h-[55px] sm:w-[70px] sm:h-[70px] rounded-full overflow-hidden cursor-pointer'>
            <img src={author.profileImage || dp} alt="" className='h-full w-full object-cover' />
          </div>

          <div>
            {/* Smaller text on mobile */}
            <div className='text-[18px] sm:text-[22px] font-semibold'>
              {author.firstName} {author.lastName}
            </div>
            <div className='text-[14px] sm:text-[18px] text-gray-600'>
              {author.headline}
            </div>
            <div className='text-[13px] sm:text-[16px] text-gray-500'>
              {moment(createdAt).fromNow()}
            </div>
          </div>
        </div>

        {/* Connection button */}
        {/* FIX: prevent overflow on mobile */}
        <div className='self-start sm:self-auto'>
          {userData._id !== author._id && (
            <ConnectionButton userId={author._id} />
          )}
        </div>
      </div>

      {/* ================= DESCRIPTION ================= */}
      <div className={`text-[14px] sm:text-[16px] ${!more ? "max-h-[80px] overflow-hidden" : ""}`}>
        {description}
      </div>

      {description && (
        <div
          className='text-[14px] font-semibold cursor-pointer text-blue-500'
          onClick={() => setMore(prev => !prev)}
        >
          {more ? "read less..." : "read more..."}
        </div>
      )}

      {/* ================= IMAGE ================= */}
      {image && (
        <div className='w-full h-[220px] sm:h-[400px] overflow-hidden rounded-lg'>
          <img src={image} alt="" className='h-full w-full object-cover rounded-lg' />
        </div>
      )}

      {/* ================= STATS ================= */}
      <div className='flex justify-between items-center py-3 border-b border-gray-300 text-[14px] sm:text-[18px]'>
        <div className='flex items-center gap-1'>
          <BiLike className='text-[#1ebbff]' />
          <span>{likes.length}</span>
        </div>

        <div
          className='cursor-pointer'
          onClick={() => setShowComment(prev => !prev)}
        >
          {comments.length} comments
        </div>
      </div>

      {/* ================= ACTION BUTTONS ================= */}
      {/* FIX: evenly spaced on mobile */}
      <div className='flex justify-around sm:justify-start sm:gap-10 py-2'>
        <div
          className='flex items-center gap-2 cursor-pointer'
          onClick={Like}
        >
          <BiLike className='w-[22px] h-[22px]' />
          <span className='text-[14px] sm:text-[16px]'>
            {likes.includes(userData._id) ? "Liked" : "Like"}
          </span>
        </div>

        <div
          className='flex items-center gap-2 cursor-pointer'
          onClick={() => setShowComment(prev => !prev)}
        >
          <FaRegCommentDots className='w-[22px] h-[22px]' />
          <span className='text-[14px] sm:text-[16px]'>Comment</span>
        </div>
      </div>

      {/* ================= COMMENTS ================= */}
      {showComment && (
        <div className='flex flex-col gap-3'>

          {/* Comment input */}
          <form
            className='flex items-center gap-2 border-b border-gray-300 pb-2'
            onSubmit={Comment}
          >
            <input
              type="text"
              placeholder='leave a comment'
              className='flex-1 outline-none text-[14px]'
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />
            <button>
              <LuSendHorizontal className='text-[#07a4ff] w-[20px] h-[20px]' />
            </button>
          </form>

          {/* Comment list */}
          {comments.map((com) => (
            <div
              key={com._id}
              className='flex flex-col gap-2 border-b border-gray-200 pb-3'
            >
              <div className='flex items-center gap-2'>
                <div className='w-[35px] h-[35px] rounded-full overflow-hidden'>
                  <img
                    src={com.user.profileImage || dp}
                    alt=""
                    className='h-full w-full object-cover'
                  />
                </div>
                <div className='text-[14px] font-semibold'>
                  {com.user.firstName} {com.user.lastName}
                </div>
              </div>
              <div className='text-[14px] text-gray-700'>
                {com.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Post
