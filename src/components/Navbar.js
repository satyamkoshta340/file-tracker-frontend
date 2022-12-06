import { useSelector, useDispatch } from "react-redux";
import Sidenav from "./Sidenav";
import { useState } from "react";
import { Link } from "react-router-dom";
import AlertDialog from "../components/AlertDialog";
import Button from '@mui/material/Button';
import avatar from "../media/avatar.png";

function Navbar() {
  const [sideNav, setSideNav] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  
  const { user } = useSelector ( state => ({
    user: state.userStore.user
  }))
  
  const login = async ()=>{
    // window.open(`${process.env.REACT_APP_SERVER_URL}/auth/google`, "_self");
    console.log("logging", email, password);
    const resp = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/login`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({email, password})
    });
    const response = await resp.json();
    if(response.status === "success"){
      dispatch({ type: "user/SET_USER", payload:  {user: response.data.user}});
      localStorage.setItem("token", response.data.token);
      setAuthenticating(false)
    }
    else{
      console.log(response);
    }
  }

  return (
    <div className='navbar align-middle'>
      {
      authenticating &&
        <AlertDialog
          name={"Register new File"} 
          content={
          <div className="file-form">
            <div className="file-form-row-block">
              <div>Email</div>
              <input type={'email'} className="file-input" onChange={(e)=>setEmail( e.target.value )} defaultValue={ email } />
            </div>
            <div className="file-form-row-block">
              <div>Password</div>
              <input type={'password'} className="file-input" onChange={(e)=>setPassword( e.target.value )} defaultValue={ password } />
            </div>
            <Button variant="contained" onClick={()=> login()}>
              Login
            </Button>
          </div>} 
          title={"Login"}
          open={authenticating}
          actionName = {"Cancel"}
          setOpen = { setAuthenticating }
        />
    }
        <div className='container nav-content'>
          <Link to={"/file-tracker-frontend"} className="logo">
            Let's Track
          </Link>
            {
              !user._id &&
              <div>
                <button className='btn' onClick={(e)=>setAuthenticating(true)}>Login</button>
              </div>
            }
            {
              user._id &&
              <div className="flex-box">
                {/* <div>{`${user.firstName} ${user.lastName}`}</div> */}
                <img src={ user.picture ? user.picture : avatar } alt="👨" className="user-pic" onClick={(e) => {
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