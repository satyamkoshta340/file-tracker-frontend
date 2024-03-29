import { useSelector, useDispatch } from "react-redux";
import Sidenav from "./Sidenav";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AlertDialog from "../components/AlertDialog";
import Button from '@mui/material/Button';
import avatar from "../media/avatar.png";
import Snackbar from "../components/Snackbar";
import { setUser } from "../store/user";
import axios from 'axios';

function Navbar() {
  const [sideNav, setSideNav] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [ snack, setSnack ] = useState({ active: false, message:"", severity:""});
  const [registering, setRegistering] = useState(false);
  const dispatch = useDispatch();
  
  const user = useSelector( state => state.user.value );
  
  const loginByGoogle = async () => {
    window.open(`${process.env.REACT_APP_SERVER_URL}/auth/google`, "_self");
  }

  const handleGoogle = async (google) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/google`, {
        credential: google.credential,
      });

      if( response.data.status === "success"){
        dispatch(setUser(response.data.user))
        localStorage.setItem("token", response.data.token);
        setAuthenticating(false);
        setSnack({
          active: true,
          message: "Logged In Successfully!",
          severity: "success"
        })
      }
      

    } catch (err) {
      console.error(err)
    }
  };
  useEffect(() => {
    /* global google */
    console.log(user)
    setTimeout(()=>{
      console.log(user)
      if (window.google && !user._id) {
        console.log("google");
        google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleGoogle,
        });
        google.accounts.id.renderButton(document.getElementById("googleDiv"), {
          // type: "standard",
          theme: "filled_black",
          // size: "small",
          text: "continue_with",
          shape: "pill",
        });
        // google.accounts.id.prompt();
        
      }
    },100)
    
  }, [authenticating]);

  const loginByEmail = async ()=>{
    // console.log("logging", email, password);

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
      if( response.data?.user ){
        dispatch(setUser(response.data.user));
        localStorage.setItem("token", response.data.token);
        setAuthenticating(false);
        setSnack({
          active: true,
          message: "Logged In Successfully!",
          severity: "success"
        })
      }
      else{
        setAuthenticating(false);
        setSnack({
          active: true,
          message: "Please Verify Email First, Verification link sent to given email.!",
          severity: "error"
        })
      }
    }
    else{
      console.log(response);
      setSnack({
        active: true,
        message: "Invalid Credentials",
        severity: "error"
      })
    }
  }

  const registerByEmail = async() =>{
    if( email.length === 0 || department.length === 0 || password.length === 0 || firstName.length === 0 || lastName.length === 0){
      setSnack({
        active: true,
        message: "Please provide all the details",
        severity: "error"
      });
      return;
    }
    const resp = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/signup`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({firstName, lastName, email, password, department})
    });
    const response = await resp.json();
    if(response.status === "success"){
      dispatch({ type: "user/SET_USER", payload:  {user: response.data.user}});
      localStorage.setItem("token", response.data.token);
      setAuthenticating(false);
      setSnack({
        active: true,
        message: "Please Verify Email, Verification link sent to given email.!",
        severity: "success"
      })
      setRegistering(false);
    }
    else{
      console.log(response);
      setSnack({
        active: true,
        message: response?.data?.message ? response?.data?.message : "Something went wrong!",
        severity: "error"
      })
    }
  }

  return (
    <div className='navbar align-middle'>
      {
        snack?.active &&
        <div style={{position: 'absolute'}}>
        <Snackbar open={snack.active} setOpen={setSnack} message={snack.message} severity={ snack.severity}/>
        </div>
      }
      {
      authenticating &&
        <AlertDialog
          name={"Register new File"} 
          content={
          <div className="file-form">
            {
              registering &&
              <div className="file-form-row-block flex-box" style={{justifyContent: "space-between", gap:"1rem"}}>
                <div style={{width:"50%"}}>
                  <div>First Name</div>
                  <input type={'string'} className="file-input" onChange={(e)=>setFirstName( e.target.value )} defaultValue={ firstName } />
                </div>
                <div style={{width:"50%"}}>
                  <div>Last Name</div>
                  <input type={'string'} className="file-input" onChange={(e)=>setLastName( e.target.value )} defaultValue={ lastName } />
                </div>
              </div>
            }
            <div className="file-form-row-block">
              <div>Email</div>
              <input type={'email'} className="file-input" onChange={(e)=>setEmail( e.target.value )} defaultValue={ email } />
            </div>
            {
              registering &&
              <div className="file-form-row-block">
                <div>Department</div>
                <input type={'string'} className="file-input" onChange={(e)=>setDepartment( e.target.value )} defaultValue={ department } />
              </div>
            }
            <div className="file-form-row-block">
              <div>Password</div>
              <input type={'password'} className="file-input" onChange={(e)=>setPassword( e.target.value )} defaultValue={ password } />
            </div>
            {
              registering ?
                <Button variant="contained" color="success" onClick={(e) => registerByEmail()}>Register</Button>:
                <Button variant="contained" onClick={()=> loginByEmail()}>
                  Login
                </Button>
            }
            <div className="flex-col-box">
              <div>
              { !registering ?
                <div className="flex-box">
                  <div>"New to Let's Track?"</div>
                  <div className="link" onClick={(e)=> setRegistering(true)}>Create an account.</div>
                </div> :
                <div className="flex-box">
                  <div>Existing User? </div>
                  <div className="link" onClick={(e)=> setRegistering(false)}> LogIn.</div>
                </div>
              }
              </div>
              <div id="googleDiv" ></div>
            </div>
          </div>} 
          title={ registering? "Register" :"Login"}
          open={authenticating}
          actionName = {"Cancel"}
          setOpen = { setAuthenticating }
        />
    }
        <div className='container nav-content'>
          <Link to={"/"} className="logo" id="logo">
            Let's Track
          </Link>
            {
              !user._id &&
              <div>
                <button className='btn' onClick={(e)=> setAuthenticating(true) }>Login/SignUp</button>
              </div>
            }
            {
              user._id &&
              <div className="flex-box">
                {/* <div>{`${user.firstName} ${user.lastName}`}</div> */}
                <img src={ user.picture ? user.picture : avatar } alt="👨" className="user-pic" onClick={(e) => {
                  setSideNav(!sideNav);
                }}/>
                <Sidenav sideNav={sideNav} setSideNav={setSideNav}/>
              </div>
            }
        </div>
    </div>
  )
}

export default Navbar