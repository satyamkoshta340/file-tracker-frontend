import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className='footer '>
        
        <div className="f-start">
        <div className="footer-col-box f-box f-info-box one">
          <Link to={"/file-tracker-frontend"} className="logo footer-logo">
            Let's Track
          </Link>
          <span className="f-info">
            <br />
            <div className="footer-deatil">
              Faculty of Engineering & Technology
            </div>
            <div className="footer-deatil">
              GKV Haridwar
            </div>
            <div className="footer-deatil">
              <b>Uttarakhand 249404</b>
            </div>
          </span>
        </div>
        <div className="footer-col-box f-box two">
          <h3 className="footer-deatil-text-heading">Social</h3>
          <a href="https://www.linkedin.com/in/satyamkoshta340/">
            <LinkedInIcon className="footer-deatil-text" />
          </a>
        </div>
        <div className="footer-col-box f-box three">
          <h3 className="footer-deatil-text-heading">Quick Links</h3>
          <Link to={"/file-tracker-frontend"} className="footer-deatil-text">
            Home
          </Link>
          <Link to={"/file-tracker-frontend/about"} className="footer-deatil-text">
            About Us
          </Link>
          <Link to={"/file-tracker-frontend/privacyPolicy"} className="footer-deatil-text">
            Privacy Policy
          </Link>
        </div>
        <div id="footer-contact" className="footer-col-box f-box four">
          <h3 className="footer-deatil-text-heading">Contact</h3>
          <a href="tel:+91 9876543210" className="footer-deatil-text">
            <PhoneIcon></PhoneIcon>
            {"  "}+91 8979836655
          </a>
          <br />
          <a
            href="mailto:koshtasatyam340@gmail.com"
            className="footer-deatil-text"
          >
            <EmailIcon></EmailIcon>{"  "}
            {"  "}koshtasatyam340@gmail.com
          </a>
        </div>
      </div>
      
      <div className="f-end">
        <p>©2022 Lets Track</p>
      </div>
    </div>
  )
}
