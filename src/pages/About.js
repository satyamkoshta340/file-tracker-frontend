import aboutImg from "../media/about.png";

export default function About() {
  return (
    <div className="page-box flex-col-box about">
      <div className="img-box">
        <img src={aboutImg} alt="" className="a-img" />
      </div>
      <h1>Hi!,</h1>
      This is a file track management website where you can check and have a track of your files
      <br/>
      <br/>
      QR Codes bridge the gap between the physical and digital worlds.
      <br/>
      <br/>
      QR Code tracking is the process of monitoring QR Code scan performance and user insights. Learn how many users scanned the QR Code, who were they.
    </div>
  )
}
