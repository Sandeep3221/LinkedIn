import React from 'react'
import { createContext } from 'react'

export const authDataContex=createContext()

const serverUrl="http://localhost:8000/"
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