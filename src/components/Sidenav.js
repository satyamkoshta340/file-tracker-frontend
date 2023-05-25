import { Link } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../store/user";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';

const style = {
    position: 'absolute',
    top: '4.5rem',
    right: '0rem',
    width: "70%",
    maxWidth: "22rem",
    backgroundColor: 'white',
    outline: 'none'
};

export default function Sidenav({ sideNav, setSideNav }) {
    // const [sideNav, setSideNav] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleOpen = () => setSideNav(true);
    const handleClose = () => setSideNav(false);

    const logout = async () => {
        // const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/logout`, { credentials: 'include'});
        // const resp = await response.json();
        // if( resp.status === "success" ){
        //     dispatch( setUser({}) );
        // }
        localStorage.removeItem("token");
        dispatch(setUser({}));
        setSideNav(false);
        navigate("/")
    }
    return (
        <div>
            <Modal
                open={sideNav}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"

            >
                <Fade in={sideNav}>
                    <Box sx={style}>
                        <div className={`nav-features`}>
                            <Link to={"/"} className="nav-feature">
                                Home
                            </Link>
                            <Link to={"/profile"} className="nav-feature">
                                Profile
                            </Link>
                            <Link to={"/files"} className="nav-feature">
                                My Files
                            </Link>
                            <Link to={"/recieved-files"} className="nav-feature">
                                Recieved Files
                            </Link>
                            <Link to={"/sent-files"} className="nav-feature">
                                Sent Files
                            </Link>
                            <Link to={"/about"} className="nav-feature">
                                About Us
                            </Link>
                            <div className="nav-feature" onClick={(e) => logout()} >
                                Logout
                            </div>
                        </div>
                    </Box></Fade>
            </Modal>


        </div>
    )
}
