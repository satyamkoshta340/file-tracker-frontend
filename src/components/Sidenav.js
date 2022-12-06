import { useState, useEffect} from "react";
import { Link } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Sidenav(flag) {
    const [sideNav, setSideNav] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{
        setSideNav(flag.flag);
    })
    const logout = async ()=>{
        // const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/logout`, { credentials: 'include'});
        // const resp = await response.json();
        // if( resp.status === "success" ){
        //     dispatch({ type: "user/SET_USER", payload:  { user:{} } });
        // }
        localStorage.removeItem("token");
        dispatch({ type: "user/SET_USER", payload:  { user:{} } });
        setSideNav(false);
        navigate("/file-tracker-frontend")
    }
    return (
        <div className={`nav-features flex-box ${sideNav ? "nav-features-active" : ""}`}>
            <Link to={"/file-tracker-frontend"} className="nav-feature">
                Home
            </Link>
            <Link to={"/file-tracker-frontend/profile"} className="nav-feature">
                Profile
            </Link>
            <Link to={"/file-tracker-frontend/files"} className="nav-feature">
                My Files
            </Link>
            <Link to={"/file-tracker-frontend/about"} className="nav-feature">
                About Us
            </Link>
            <div  className="nav-feature" onClick={(e)=>logout()} >
                Logout
            </div>

        </div>
    )
}
