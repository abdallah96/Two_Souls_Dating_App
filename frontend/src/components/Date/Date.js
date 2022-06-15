import './Date.css';
import React,{useEffect} from "react";
import Sidenav from '../Sidenav/Sidenav';
import axios from "axios";
import CoffeeDateSuggestions from '../Date/DateSuggestions/DateSuggestions';
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
const Date = () => {
    const navigate = useNavigate();
  const [cookies,  removeCookie] = useCookies([]);
  useEffect(() => {
    const verifyUser = async () => {
      if (!cookies.jwt) {
          console.log("jwt does not exist")
        navigate("/signin");
      } else {
        const { data } = await axios.post(
          "http://localhost:5000",
          {cookies},
          {
            withCredentials: true,
          }
        );
        if (!data.status) {
          removeCookie("jwt");
          removeCookie("userid");
          removeCookie("isAdmin");
          navigate("/signin");
        } 
      }
    };
    verifyUser();
  }, [cookies, navigate, removeCookie]);
  return (
    <div className="container">
        <div className="sidenav">
            <Sidenav/>
        </div>
        <div className="suggestion">
          <CoffeeDateSuggestions/>
        </div>
    </div>
  )
}

export default Date;