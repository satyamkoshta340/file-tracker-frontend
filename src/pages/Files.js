import { ReactComponent as FilesSVG} from "../media/files.svg"
import { useEffect } from "react"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CreateFileButton from "../components/CreateFileButton";

export default function Files() {

  const navigate = useNavigate();
  const user = useSelector ( state => state.user.value );
  const files = useSelector( state => state.files.allFiles );

  useEffect(()=>{
    if( !user._id ){
      navigate("/");
    }
  }, [])

  const openFile = async (fileId) => {
    navigate(`/track/${fileId}`)
  }
  return (
    <div className="flex-box page-box my-files">
    {
      files.length === 0 &&
      <>
        <FilesSVG  className="home-background" style={{top: 80, position: 'absolute', zIndex: -1}}/>
        <div className="flex-col-box" style={{paddingTop: '12rem', paddingBottom: '2rem'}}>
          <h3>You haven't Registered any file yet!</h3>
          <CreateFileButton />
        </div>
      </>
    }
    {
      files.length !== 0 &&
      <div className="flex-col-box" >
        <div>
        <CreateFileButton />
          </div>
        
        <div className="files-box">
        {
          files.map(file=>{
            return <div className="file-container flex-col-box" key={file.fileId} onClick={(e)=>openFile(file.fileId)}>
              <div>
                <b style={{color: "rgb(108, 108, 108)", fontStyle: "italic"}}>Name</b> <br/>
                {file.fileName}
              </div>
              <div>
              <b style={{color: "rgb(108, 108, 108)", fontStyle: "italic"}}>Description</b> <br/>
                {file.description}
              </div>
            </div>
          })
        }
      </div>
      </div>
    }
    </div>
  )
}
