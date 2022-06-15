import React, { useState,useEffect } from "react";
import axios from "axios";
import {Link, useNavigate} from 'react-router-dom';
import "./SignUp.css";
import { useCookies } from "react-cookie";
import Slider from "@mui/material/Slider";

const SignUp = () => {
  //   const [cookies, setCookie, removeCookie] = useCookies(null);
  // let navigate = useNavigate();

  const navigate = useNavigate();
  const [cookies] = useCookies([]);
  var passionTemp;
  var petTemp;

  const [selectedPassions, setSelectedPassions] = useState([]);
  const [selectedDrink, setSelectedDrink] = useState("");
  const [selectedEducation, setSelectedEducation] = useState("");
  const [selectedFood, setSelectedFood] = useState("");
  const [selectedPet, setSelectedPet] = useState([]);
  const [selectedSmoking, setSelectedSmoking] = useState("");
  const [selectedSocialMedia, setSelectedSocialMedia] = useState("");
  const [location, setLocation] = useState([]);
  const [file, setFile] = useState("");
  const [fullName, setFullName] = useState("");
  const [date, setDobDate] = useState("");
  const [month, setDobMonth] = useState("");
  const [year, setDobYear] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [PreferredGender, setPreferredgender] = useState("");
  const [distance, setDistance] = useState();
  const [fileName, setFileName] = useState("");
  const [about, setAbout] = useState("");

   var myid = cookies.userid;

   

  //  debugger

  var options = {
    enableHighAccuracy: true,

    timeout: 5000,

    maximumAge: 0,
  };
  function success(pos) {
    var crd = pos.coords;
    var tempLocation = [];
    tempLocation.push(Number(crd.longitude));
    tempLocation.push(Number(crd.latitude));
    setLocation(tempLocation);
  }
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, error, options);

  const handlePassionChange = (event) => {
    passionTemp = selectedPassions;
    if (event.target.checked) {
      passionTemp.push(event.target.value);
    } else {
      var index = passionTemp.indexOf(event.target.value);
      if (index !== -1) {
        passionTemp.splice(index, 1);
      }
    }
    setSelectedPassions(passionTemp);
  };

  const handlePetChange = (event) => {
    petTemp = selectedPet;
    if (event.target.checked) {
      petTemp.push(event.target.value);
    } else {
      var index = petTemp.indexOf(event.target.value);
      if (index !== -1) {
        petTemp.splice(index, 1);
      }
    }
    setSelectedPet(petTemp);
  };

  const handleFoodChange = (event) => {
    setSelectedFood(event.target.value);
  };

  const handleDrinkChange = (event) => {
    setSelectedDrink(event.target.value);
  };

  const handleEducationChange = (event) => {
    setSelectedEducation(event.target.value);
  };

  const handleSmokingChange = (event) => {
    setSelectedSmoking(event.target.value);
  };

  const handleSocialMediaChange = (event) => {
    setSelectedSocialMedia(event.target.value);
  };

  const handleDistance = (event, value) => {
    setDistance(value);
  };

  const handleDOBDate = (e) => {
    setDobDate(e.target.value);
  };

  const handleDOBMonth = (e) => {
    setDobMonth(e.target.value);
  };

  const handleDOBYear = (e) => {
    setDobYear(e.target.value);
  };

  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
  };

  const handlePreferredGender = (e) => {
    setPreferredgender(e.target.value);
  };
  
  const handleFullName = (event) => {
    setFullName(event.target.value);
  };

 
  

  const handleAbout = (event) => {
    setAbout(event.target.value);
  };

  // const ButtonSubmit = () => {
  //   navigate("/signin")
  // };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      var form = new FormData();
      
      form.append("file", file);
      form.append("name", fullName);
      form.append("about", about);
      form.append("passion", selectedPassions);
      form.append("bestpets", selectedPet);
      form.append("bestdrink", selectedDrink);
      form.append("education", selectedEducation);
      form.append("foodpreferences", selectedFood);
      form.append("smoking", selectedSmoking);
      form.append("Socialmedia", selectedSocialMedia);
      form.append("gender", selectedGender);
      form.append("preferredgender", PreferredGender);
      form.append("fileName", fileName);
      form.append("dob", date + "-" + month + "-" + year);
      form.append("location", location);
      form.append("findwithin", distance);
      form.append("userid", myid)
     
      await axios.post("http://localhost:5000/api/addprofile", form)
      navigate("/signin");
    } catch (err) {
      console.log(err);
    }
  };

  

  return (
    <div className="container">
      <div className="sidenav">
        <div className="Profile">
          <div className="upper-container-profile"></div>
          <form onSubmit={handleSubmit}>
            <section>
              <label>Choose picture</label>
              <input
                className="fileInput"
                type="file"
                name="image"
                onChange={handleFile}
                required
              ></input>
              <label htmlFor="first_name"> FullName</label>
              <input
                id="first_name"
                type="text"
                name="first_name"
                placeholder="First Name"
                required={true}
                value={fullName}
                onChange={handleFullName}
              />
              <label> Birthday</label>
              <div className="multiple-input-container">
                <input
                  id="dob_day"
                  type="number"
                  name="dob_day"
                  placeholder="DD"
                  required={true}
                  value={date}
                  onChange={handleDOBDate}
                />
                <input
                  id="dob_month"
                  type="number"
                  name="dob_month"
                  placeholder="MM"
                  required={true}
                  value={month}
                  onChange={handleDOBMonth}
                />
                <input
                  id="dob_year"
                  type="number"
                  name="dob_year"
                  placeholder="YYYY"
                  required={true}
                  value={year}
                  onChange={handleDOBYear}
                />
              </div>
              <label> Gender</label>
              <div className="multiple-input-container">
                <input
                  id="man-gender-identity"
                  type="radio"
                  name="gender_identity"
                  value="man"
                  onChange={handleGenderChange}
                  checked={selectedGender === "man"}
                />
                <label htmlFor="man-gender-identity"> Man</label>

                <input
                  id="woman-gender-identity"
                  type="radio"
                  name="gender_identity"
                  value="woman"
                  onChange={handleGenderChange}
                  checked={selectedGender === "woman"}
                />
                <label htmlFor="woman-gender-identity"> Woman</label>

                <input
                  id="more-gender-identity"
                  type="radio"
                  name="gender_identity"
                  value="other"
                  onChange={handleGenderChange}
                  checked={selectedGender === "other"}
                />
                <label htmlFor="more-gender-identity">Other</label>
              </div>

              {/*........ ...........................What I wanna see ...............................*/}

              <label>Show within distance</label>
              <Slider
                defaultValue={1}
                aria-label="Default"
                valueLabelDisplay="auto"
                onChange={handleDistance}
                value={distance}
              />
              <label>Show me</label>
              <div className="multiple-input-container">
                <input
                  id="man-gender-interest"
                  type="radio"
                  name="gender_interest"
                  value="man"
                  onChange={handlePreferredGender}
                />

                <label htmlFor="man-gender-interest"> Man</label>
                <input
                  id="woman-gender-interest"
                  type="radio"
                  name="gender_interest"
                  value="woman"
                  onChange={handlePreferredGender}
                />
                <label htmlFor="woman-gender-interest"> woman</label>
                <input
                  id="everyone-gender-interest"
                  type="radio"
                  name="gender_interest"
                  value="woman"
                  onChange={handlePreferredGender}
                />
                <label htmlFor="everyone-gender-interest"> everyone</label>
              </div>

              <label htmlFor="about"> About me</label>
              <input
                id="about"
                type="text"
                name="about"
                placeholder="I like sports..."
                value={about}
                onChange={handleAbout}
              />
           
              <input type="submit"  />  

          
            </section>
          </form>
        </div>
      </div>
      {/*........ ...........................Questionnaire ...............................*/}
      <div className="HomeMain">
        <div className="Questionnaire">
          <h2>ADD MORE DETAILS</h2>

          <form onSubmit={handleSubmit} className="questionnaire-form">
            <section>
              <label>Passions</label>
              <div className="multiple-input-container">
                <input
                  id="passion-hiphop"
                  type="checkbox"
                  name="passion"
                  value="hiphop"
                  onChange={handlePassionChange}
                />
                <label htmlFor="passion-hiphop">Hip Hop</label>
                <input
                  id="passion-basketball"
                  type="checkbox"
                  name="passion"
                  value="basketball"
                  onChange={handlePassionChange}
                />
                <label htmlFor="passion-basketball">Basketball</label>
                <input
                  id="passion-theater"
                  type="checkbox"
                  name="passion"
                  value="theater"
                  onChange={handlePassionChange}
                />
                <label htmlFor="passion-theater">Theater</label>
                <br />
              </div>
              <div className="multiple-input-container">
                <input
                  id="passion-meditation"
                  type="checkbox"
                  name="passion"
                  value="meditation"
                  onChange={handlePassionChange}
                />
                <label htmlFor="passion-meditation">Meditation</label>
                <input
                  id="passion-yoga"
                  type="checkbox"
                  name="passion"
                  value="yoga"
                  onChange={handlePassionChange}
                />
                <label htmlFor="passion-yoga">Yoga</label>
                <input
                  id="passion-reading"
                  type="checkbox"
                  name="passion"
                  value="reading"
                  onChange={handlePassionChange}
                />
                <label htmlFor="passion-reading">Reading</label>
              </div>
              <div className="multiple-input-container">
                <input
                  id="passion-running"
                  type="checkbox"
                  name="passion"
                  value="running"
                  onChange={handlePassionChange}
                />
                <label htmlFor="passion-running">Running</label>
                <input
                  id="passion-photography"
                  type="checkbox"
                  name="passion"
                  value="photography"
                  onChange={handlePassionChange}
                />
                <label htmlFor="passion-photography">Photography</label>
                <input
                  id="passion-makup"
                  type="checkbox"
                  name="passion"
                  value="makeup"
                  onChange={handlePassionChange}
                />
                <label htmlFor="passion-makup">Makeup</label>
              </div>
              <div className="multiple-input-container">
                <input
                  id="passion-gym"
                  type="checkbox"
                  name="passion"
                  value="gym"
                  onChange={handlePassionChange}
                />
                <label htmlFor="passion-gym">Gym</label>
                <input
                  id="passion-social-media"
                  type="checkbox"
                  name="passion"
                  value="social-media"
                  onChange={handlePassionChange}
                />
                <label htmlFor="passion-social-media">Social Media</label>
                <input
                  id="passion-movies"
                  type="checkbox"
                  name="passion"
                  value="movies"
                  onChange={handlePassionChange}
                />
                <label htmlFor="passion-movies">Movies</label>
              </div>

              <label>Drink of Choice</label>
              <div className="multiple-input-container">
                <input
                  id="drink-choice-wine"
                  type="radio"
                  name="drink-choice"
                  value="wine"
                  onChange={handleDrinkChange}
                  checked={selectedDrink === "wine"}
                />
                <label htmlFor="drink-choice-wine">Wine</label>
                <input
                  id="drink-choice-all"
                  type="radio"
                  name="drink-choice"
                  value="all"
                  onChange={handleDrinkChange}
                  checked={selectedDrink === "all"}
                />
                <label htmlFor="drink-choice-all">All drinks</label>
                <input
                  id="drink-choice-beer"
                  type="radio"
                  name="drink-choice-beer"
                  value="beer"
                  onChange={handleDrinkChange}
                  checked={selectedDrink === "beer"}
                />
                <label htmlFor="drink-choice-beer">Beer</label>
              </div>
              <div className="multiple-input-container">
                <input
                  id="drink-choice-sober"
                  type="radio"
                  name="drink-choice-sober"
                  value="sober"
                  onChange={handleDrinkChange}
                  checked={selectedDrink === "sober"}
                />
                <label htmlFor="drink-choice-sober">Sober</label>
                <input
                  id="drink-choice-cocktails"
                  type="radio"
                  name="drink-choice"
                  value="cocktails"
                  onChange={handleDrinkChange}
                  checked={selectedDrink === "cocktails"}
                />
                <label htmlFor="drink-choice-cocktails">Cocktails</label>
              </div>

              <label>Education</label>
              <div className="multiple-input-container">
                <input
                  id="education-high-school"
                  type="radio"
                  name="education"
                  value="high-school"
                  onChange={handleEducationChange}
                  checked={selectedEducation === "high-school"}
                />
                <label htmlFor="education-high-school">High Shool</label>
                <input
                  id="education-bachelor"
                  type="radio"
                  name="education"
                  value="bachelor"
                  onChange={handleEducationChange}
                  checked={selectedEducation === "bachelor"}
                />
                <label htmlFor="education-bachelor">Bachelor</label>
                <input
                  id="education-master"
                  type="radio"
                  name="education"
                  value="master"
                  onChange={handleEducationChange}
                  checked={selectedEducation === "master"}
                />
                <label htmlFor="education-master">Master</label>
              </div>
              <div className="multiple-input-container">
                <input
                  id="education-phd"
                  type="radio"
                  name="education"
                  value="phd"
                  onChange={handleEducationChange}
                  checked={selectedEducation === "phd"}
                />
                <label htmlFor="education-phd">PhD</label>
              </div>
            </section>

            <section>
              <label>Food Preferences</label>
              <div className="multiple-input-container">
                <input
                  id="food-vegan"
                  type="radio"
                  name="food"
                  value="vegan"
                  onChange={handleFoodChange}
                />
                <label htmlFor="food-vegan">Vegan</label>
                <input
                  id="food-vegetarian"
                  type="radio"
                  name="food"
                  value="Vegetarian"
                  onChange={handleFoodChange}
                />
                <label htmlFor="food-vegetarian">Vegetarian</label>
                <input
                  id="food-halal"
                  type="radio"
                  name="food"
                  value="halal"
                  onChange={handleFoodChange}
                />
                <label htmlFor="food-halal">Halal</label>
              </div>
              <div className="multiple-input-container">
                <input
                  id="food-carnivore"
                  type="radio"
                  name="food"
                  value="carnivore"
                  onChange={handleFoodChange}
                />
                <label htmlFor="food-carnivore">Carnivore</label>
                <input
                  id="food-omnivore"
                  type="radio"
                  name="food"
                  value="omnivore"
                  onChange={handleFoodChange}
                />
                <label htmlFor="food-omnivore">Omnivore</label>
              </div>
              <label>Which Pet do you like?</label>
              <div className="multiple-input-container">
                <input
                  id="pet-dog"
                  type="radio"
                  name="pet"
                  value="dog"
                  onChange={handlePetChange}
                />
                <label htmlFor="pet-dog">Dog</label>
                <input
                  id="pet-fish"
                  type="radio"
                  name="pet"
                  value="fish"
                  onChange={handlePetChange}
                />
                <label htmlFor="pet-fish">Fish</label>
                <input
                  id="pet-cat"
                  type="radio"
                  name="pet"
                  value="cat"
                  onChange={handlePetChange}
                />
                <label htmlFor="pet-cat">Cat</label>
              </div>
              <div className="multiple-input-container">
                <input
                  id="pet-reptiles"
                  type="checkbox"
                  name="pet"
                  value="reptiles"
                  onChange={handlePetChange}
                />
                <label htmlFor="pet-reptiles">Reptiles</label>
                <input
                  id="pet-free"
                  type="checkbox"
                  name="pet"
                  value="pet-free"
                  onChange={handlePetChange}
                />
                <label htmlFor="pet-free">Pet free</label>
              </div>
              <label>Smoking</label>
              <div className="multiple-input-container">
                <input
                  id="smoking-socially"
                  type="radio"
                  name="smoking"
                  value="socially"
                  onChange={handleSmokingChange}
                  checked={selectedSmoking === "socially"}
                />
                <label htmlFor="smoking-socially">Socially</label>
                <input
                  id="smoking-when-drinking"
                  type="radio"
                  name="smoking"
                  value="when-drinking"
                  onChange={handleSmokingChange}
                  checked={selectedSmoking === "when-drinking"}
                />
                <label htmlFor="smoking-when-drinking">When drinking</label>
                <input
                  id="smoking-non-smoker"
                  type="radio"
                  name="smoking"
                  value="non-smoker"
                  onChange={handleSmokingChange}
                  checked={selectedSmoking === "non-smoker"}
                />
                <label htmlFor="smoking-non-smoker">Non-smoker</label>
              </div>
              <label>Social Media</label>
              <div className="multiple-input-container">
                <input
                  id="social-media-influencer"
                  type="radio"
                  name="social-media"
                  value="influencer"
                  onChange={handleSocialMediaChange}
                  checked={selectedSocialMedia === "influencer"}
                />

                <label htmlFor="social-media-influencer">Influencer</label>
                <input
                  id="social-media-socially"
                  type="radio"
                  name="social-media"
                  value="socially"
                  onChange={handleSocialMediaChange}
                  checked={selectedSocialMedia === "socially"}
                />
                <label htmlFor="social-media-socially">Socially</label>
                <input
                  id="social-media-off-grid"
                  type="radio"
                  name="gender_identity"
                  value="off-grid"
                  onChange={handleSocialMediaChange}
                  checked={selectedSocialMedia === "off-grid"}
                />
                <label htmlFor="social-media-off-grid">Off Grid</label>
              </div>
            </section>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
