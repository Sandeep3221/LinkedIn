import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Signup from './Pages/Signup'
import Login from './Pages/Login'
import { userDataContex } from './Contex/UserContex'
import Network from './Pages/Network'
import Profile from './Pages/Profile'

function App() {
  let {userData,loading}=useContext(userDataContex)
  if (loading) return <div>Loading...</div>;
  return (
    <Routes>
      <Route path='/' element={userData?<Home/>:<Navigate to="/login"/>}/>
      <Route path='/signup' element={userData?<Navigate to="/"/>:<Signup/>}/>
      <Route path='/login' element={userData?<Navigate to="/"/>:<Login/>}/>
      <Route path='/network' element={userData?<Network/>:<Navigate to="/login"/>}/>
      <Route path='/profile' element={userData?<Profile/>:<Navigate to="/login"/>}/>
    </Routes>
  )
}

export default App