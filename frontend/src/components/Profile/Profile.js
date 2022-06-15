import React, { useState, useEffect } from "react";
import "./Profile.css";
import axios from "axios";
import Slider from "@mui/material/Slider";
import { useCookies } from "react-cookie";
import { Avatar } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [cookies, removeCookie] = useCookies([]);
  const [location, setLocation] = useState([]);
  const [file, setFile] = useState("");
  const [fullName, setFullName] = useState("");
  const [date, setDobDate] = useState("");
  const [month, setDobMonth] = useState("");
  const [year, setDobYear] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [PreferredGender, setPreferredgender] = useState("");
  const [distance, setDistance] = useState("");
  const [fileName, setFileName] = useState("");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState();
  const navigate = useNavigate();

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
  var userId = {
    myid: cookies.userid,
  };

  useEffect(() => {
    async function getProfileData() {
      await axios
        .get("http://localhost:5000/api/getmyprofile", { params: userId })
        .then((response) => {
          setFullName(response.data.name);
          setDobDate(response.data.dob.split("-")[0]);
          setDobMonth(response.data.dob.split("-")[1]);
          setDobYear(response.data.dob.split("-")[2]);
          setSelectedGender(response.data.gender);
          setPreferredgender(response.data.preferredgender);
          setDistance(response.data.findwithin);
          setAbout(response.data.about);
        })
        .catch(() => {
          console.log("no data has been received");
        });
    }
    getProfileData();

    async function getmypicture() {
      await axios
        .get("http://localhost:5000/api/getmypicture/", { params: userId })
        .then((response) => {
          setImage(response.data);
        })
        .catch(() => {
          console.log("picture not received");
        });
    }
    getmypicture();
  }, []);

  const deleteUser = async () => {
    await axios
      .post("http://localhost:5000/api/deleteuser", { params: userId })
      .then((response) => {
        logOut();

      })
      .catch((error) => {
        console.log(error);
      });
  };
  const logOut = () => {
    removeCookie("jwt");
    removeCookie("userid");
    removeCookie("isAdmin");
    navigate("/");
  };
  const questionnaire = () => {
    
    navigate("/profile");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      var form = new FormData();
      form.append("userid", cookies.userid);
      form.append("file", file);
      form.append("name", fullName);
      form.append("about", about);
      form.append("gender", selectedGender);
      form.append("preferredgender", PreferredGender);
      form.append("fileName", fileName);
      form.append("dob", date + "-" + month + "-" + year);
      form.append("location", location);
      form.append("findwithin", distance);
      // form.append("img", image);
      await axios.post("http://localhost:5000/api/updateprofiledetails", form);
      
      await axios
        .get("http://localhost:5000/api/getmypicture/", { params: userId })
        .then((response) => {
          setImage(response.data);
        })
        .catch(() => {
          console.log("picture not received");
        });
    } catch (err) {
      console.log(err);
    }
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

  const handleGenderChange = (e) => {
    setSelectedGender(e.target.value);
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

  const handleFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };


  return (
    <div className="Profile">
      <div className="upper-container-profile">
        <div className="image-container-profile">
          {/* <img src="/images/img1.jpg" alt="" /> */}
          <Avatar
            className="avatarProfileEdit"
            alt="User profile"
            src={`data:image/jpeg;base64,${image}`}
          />
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <section>
          <label>Edit picture</label>
          <input
            type="file"
            name="image"
            onChange={handleFile}
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
              checked={PreferredGender === "man"}
            />

            <label htmlFor="man-gender-interest"> Man</label>
            <input
              id="woman-gender-interest"
              type="radio"
              name="gender_interest"
              value="woman"
              onChange={handlePreferredGender}
              checked={PreferredGender === "woman"}
            />
            <label htmlFor="woman-gender-interest"> woman</label>
            <input
              id="everyone-gender-interest"
              type="radio"
              name="gender_interest"
              value="everyone"
              onChange={handlePreferredGender}
              checked={PreferredGender === "everyone"}
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
          <input type="submit" value="Update Profile" />
          <button className="profileDelete" onClick={deleteUser}>
            Delete Account
          </button>
          <button className="profileLogOut" onClick={logOut}>
            Log out
          </button>
          <button className="profileLogOut" onClick={questionnaire}>
            Edit questionnaire
          </button>
        </section>
      </form>
    </div>
  );
};

export default Profile;
