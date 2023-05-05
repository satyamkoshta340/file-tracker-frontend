import { useState, useEffect} from "react";
import { Link } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../store/user";

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
        //     dispatch( setUser({}) );
        // }
        localStorage.removeItem("token");
        dispatch( setUser({}));
        setSideNav(false);
        navigate("/")
    }
    return (
        <div className={`nav-features flex-box ${sideNav ? "nav-features-active" : ""}`}>
            <Link to={"/"} className="nav-feature">
                Home
            </Link>
            <Link to={"/profile"} className="nav-feature">
                Profile
            </Link>
            <Link to={"/files"} className="nav-feature">
                My Files
            </Link>
            <Link to={"/about"} className="nav-feature">
                About Us
            </Link>
            <div  className="nav-feature" onClick={(e)=>logout()} >
                Logout
            </div>

        </div>
    )
}
