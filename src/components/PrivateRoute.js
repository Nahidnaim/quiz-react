import {useAuth} from "../contexts/AuthContext";
import {Navigate, Route} from "react-router-dom"

export default function PrivateRoute({children}){
    const auth = useAuth()

    return auth ? children : <Navigate to="/login" />
}