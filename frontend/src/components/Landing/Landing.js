import "./Landing.css";
import React from "react";
import travel_01 from "../../assets/titlecover.jpg";
import travel_02 from "../../assets/dating.jpg";
import travel_03 from "../../assets/dating3.jpg";
import Hero from "../Hero";
import Navbar from "../Navbar";
import Slider from "../Slider";


function home() {
  const navbarLinks = [
    
    { url: "/signin", title: "SignIn" },
    { url: "/register", title: "Create Account" },
  ];

  return (
    <div className="App">
      <Navbar navbarLinks={navbarLinks} />
      <Hero imageSrc={travel_01} />
      <Slider
        imageSrc={travel_02}
        title={"Single today? Not tomorrow! "}
        subtitle={
          "Find matches, go on coffee and blind dates"
        }
      />
      <Slider
        imageSrc={travel_03}
        title={"Find that special someone"}
        subtitle={"Your dream partner is only a few clicks away."}
        flipped={true}
      />
    </div>
  );
}

export default home;
