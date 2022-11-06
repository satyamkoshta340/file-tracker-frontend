import { ReactComponent as FilesSVG} from "../media/files.svg"
import { useState } from "react"

export default function Files() {
  const [files, setFiles] = useState([]);

  return (
    <div className="flex-box page-box">
      {
        files.length === 0 &&
        <>
          <FilesSVG className="home-background" style={{top: '0rem' }}/>
          <h3>You haven't Registered any file yet!</h3>
        </>
      }
      {
        files.length !== 0 &&
        <div className="files-box">
          {
            files.map(file=>{
              return <div className="file-container">
                {file.fileName}
                </div>
            })
          }
        </div>
      }
    </div>
  )
}
