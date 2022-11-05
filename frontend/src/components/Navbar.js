import { useSelector } from "react-redux";
import Sidenav from "./Sidenav";
import { useState } from "react";

function Navbar() {
  const [sideNav, setSideNav] = useState(true);
  const { user } = useSelector ( state => ({
    user: state.userStore.user
  }))

  const login = ()=>{
    window.open(`${process.env.REACT_APP_SERVER_URL}/auth/google`, "_self");
  }

  return (
    <div className='navbar align-middle'>
        <div className='container nav-content'>
            <div className='logo'>Lets Track</div>
            {
              !user.gID &&
              <div>
                <button className='btn' onClick={login}>Login</button>
              </div>
            }
            {
              user.gID &&
              <div className="flex-box">
                {/* <div>{`${user.firstName} ${user.lastName}`}</div> */}
                <img src={ user.picture } alt="👨" className="user-pic" onClick={(e) => {
                  setSideNav(!sideNav);
                }}/>
                <Sidenav flag={sideNav}/>
              </div>
            }
        </div>
    </div>
  )
}

export default Navbar