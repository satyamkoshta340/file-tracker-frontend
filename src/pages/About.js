import aboutImg from "../media/about.png";

export default function About() {
  return (
    <div className="page-box flex-col-box">
      <div className="img-box">
        <img src={aboutImg} alt="" className="a-img" />
      </div>
      <h1>Hi!,</h1>
      <br/>
      This is a file track management website where you can check and have a track of your files
    </div>
  )
}
