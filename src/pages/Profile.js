import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate  } from "react-router-dom";

const Profile = () => {
    const { user } = useSelector ( state => ({
        user: state.userStore.user
    }));
    const navigate = useNavigate();
    useEffect( ()=>{
        if(!user.gID){
            navigate("/file-tracker-frontend")
        }
    }, [user, navigate])
    return (
        <div className="profile page-box flex-box">
            <div className="profile-container">
                <img src={user.picture} alt="👨" className="profile-img"/>
                <div>
                    <h3> { user.firstName }  {user.lastName}</h3>
                    <h3> { user.email } </h3>
                </div>
            </div>
            
        </div>
    )
}

export default Profile;