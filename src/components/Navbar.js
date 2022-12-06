import { useSelector, useDispatch } from "react-redux";
import Sidenav from "./Sidenav";
import { useState } from "react";
import { Link } from "react-router-dom";
import AlertDialog from "../components/AlertDialog";
import Button from '@mui/material/Button';
import avatar from "../media/avatar.png";
import Snackbar from "../components/Snackbar";

function Navbar() {
  const [sideNav, setSideNav] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [ snack, setSnack ] = useState({ active: false, message:"", severity:""});
  const [registering, setRegistering] = useState(false);
  const dispatch = useDispatch();
  
  const { user } = useSelector ( state => ({
    user: state.userStore.user
  }))
  
  const login = async ()=>{
    // window.open(`${process.env.REACT_APP_SERVER_URL}/auth/google`, "_self");
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
      dispatch({ type: "user/SET_USER", payload:  {user: response.data.user}});
      localStorage.setItem("token", response.data.token);
      setAuthenticating(false);
      setSnack({
        active: true,
        message: "Logged In Successfully!",
        severity: "success"
      })
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

  const register = async() =>{
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
        message: "Account Created Successfully!",
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
                <Button variant="contained" color="success" onClick={(e) => register()}>Register</Button>:
                <Button variant="contained" onClick={()=> login()}>
                  Login
                </Button>
            }
            <div>
              { !registering ?
                <div className="flex-box">
                  <p>"New to Let's Track?"</p>
                  <p className="link" onClick={(e)=> setRegistering(true)}>Create an account.</p>
                </div> :
                <div className="flex-box">
                  <p>Existing User? </p>
                  <p className="link" onClick={(e)=> setRegistering(false)}> LogIn.</p>
                </div>
              }
            </div>
          </div>} 
          title={ registering? "Register" :"Login"}
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