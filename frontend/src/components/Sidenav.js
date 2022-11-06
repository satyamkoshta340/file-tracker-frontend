import { useState, useEffect} from "react";
import { Link } from 'react-router-dom';

export default function Sidenav(flag) {
    const [sideNav, setSideNav] = useState(false);
    useEffect(()=>{
        setSideNav(flag.flag);
    })
    return (
        <div className={`nav-features flex-box ${sideNav ? "nav-features-active" : ""}`}>
            <Link to={"/file-tracker"} className="nav-feature">
                Home
            </Link>
            <Link to={"/file-tracker/files"} className="nav-feature">
                My Files
            </Link>
            <Link to={"/file-tracker/about"} className="nav-feature">
                About Us
            </Link>
            <Link to={"/file-tracker/about"} className="nav-feature">
                Logout
            </Link>

        </div>
    )
}
