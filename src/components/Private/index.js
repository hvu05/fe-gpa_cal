import { Navigate, Outlet } from "react-router-dom"

function Private() {
    const token = localStorage.getItem("token") 

    return token ? <Outlet /> : <Navigate to="/" replace />
}

export default Private
