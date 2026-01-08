import { Navbar } from "@/components/web/navbar"
import { ReactNode } from "react"

const SharedLayout = ({children}:{children:ReactNode}) => {
  return (
    <>
    <Navbar/>
    {children}</>
  )
}

export default SharedLayout