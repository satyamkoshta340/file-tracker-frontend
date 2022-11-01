import { useState, useEffect} from "react";
import { Link } from 'react-router-dom';

export default function Sidenav(flag) {
    const [sideNav, setSideNav] = useState(false);
    useEffect(()=>{
        setSideNav(flag.flag);
    })
    return (
        <div className={`nav-features flex-box ${sideNav ? "nav-features-active" : ""}`}>
            <Link to={"/"} className="nav-feature">
                Home
            </Link>
            <Link to={"/files"} className="nav-feature">
                My Files
            </Link>
            <Link to={"about"} className="nav-feature">
                About Us
            </Link>

        </div>
    )
}
