import './Home.css';
import React,{useState,useEffect} from "react";
import Sidenav from '../Sidenav/Sidenav';
import axios from "axios";
import Suggestions from '../Suggestions/Suggestions';
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { toast, ToastContainer } from "react-toastify";
const Home = () => {
    const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies([]);
  useEffect(() => {
    const verifyUser = async () => {
      debugger
      if (!cookies.jwt ) {
          console.log("jwt does not exist")
        navigate("/signin");
      } 
      else if (cookies.isAdmin==="true") {
        navigate("/admin");
      } 
      else {
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
        // else
        //   toast(`Hi ${data.user} 🦄`, {
        //     theme: "dark",
        //   });
      }
    };
    verifyUser();
  }, [cookies, navigate, removeCookie]);
  const logOut = () => {
    removeCookie("jwt");
    removeCookie("userid");
    removeCookie("isAdmin");
    navigate("/");
  };
  return (
    <div className="container">
        <div className="sidenav">

            <Sidenav/>

        </div>
        <div className="suggestion">
          <Suggestions 
       />
        </div>
       

   



    </div>
  )
}

export default Home;