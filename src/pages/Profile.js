import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate  } from "react-router-dom";
import avatar from "../media/avatar.png";

const Profile = () => {
    const { user } = useSelector ( state => ({
        user: state.userStore.user
    }));
    const navigate = useNavigate();
    useEffect( ()=>{
        if(!user._id ){
            navigate("/file-tracker-frontend")
        }
    }, [user, navigate])
    return (
        <div className="profile page-box flex-box">
            <div className="profile-container">
                <img src={user.picture ? user.picture : avatar} alt="👨" className="profile-img"/>
                <div className="profile-item">
                    <div className="profile-row">
                        <div className="profile-row-title">FirstName</div>
                        <div>{ user.firstName }</div>
                    </div>
                    <div className="profile-row">
                        <div className="profile-row-title">LastName</div>
                        <div>{ user.lastName }</div>
                    </div>
                    <div className="profile-row">
                        <div className="profile-row-title">Email</div>
                        <div>{ user.email }</div>
                    </div>
                    <div className="profile-row">
                        <div className="profile-row-title">Department</div>
                        <div>{ user.department }</div>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default Profile;