import React from 'react'
import { createContext } from 'react'

export const authDataContex=createContext()

const serverUrl="https://linkedin-backend-n0rz.onrender.com"
let value={
        serverUrl
}

function AuthContex({children}) {
  return (
        <authDataContex.Provider value={value}>
           {children}     
        </authDataContex.Provider>
  )
}
export default AuthContex
