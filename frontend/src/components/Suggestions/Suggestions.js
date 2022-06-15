import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import "./Suggestions.css";
import Tags from "../../Tags/Tags";
import Axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useCookies } from "react-cookie";

const Suggestions = () => {
  const [cookies] = useCookies([]);
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isToggled, setIsToggled] = useState(true);
  const [age, setAge] = useState("");
  const [distancefromme, setDistancefromme] = useState("");
  const [myloc, setMyloc] = useState("");
  const [oncount, setOncount] = useState(0);

  var mylocat;
  var firstData;

  var mydata = {
    myid: cookies.userid,
  };

  setTimeout(() => {
    setIsToggled(false);
  }, 1000);

  const [isToggled2, setIsToggled2] = useState(true);

  setTimeout(() => {
    setIsToggled2(false);
  }, 1000);

  useEffect(() => {
    Axios.get("http://localhost:5000/api/getuserprofile", {
      params: mydata,
    }).then((response) => {
      firstData = response.data.data;
      setAllData(response.data.data);
      setMyloc(response.data.mylocation.coordinates);
      mylocat = response.data.mylocation.coordinates;
      showfirstprofile();
      debugger;
      if (response.data.data.length == 0) {
        document.getElementById("card_div").style.display = "none";
        document.getElementById("likebutton").style.display = "none";
        document.getElementById("dislikelikebutton").style.display = "none";
        document.getElementById("lastcard_div").style.display = "flex";
        document.getElementById("reportbutton").style.display = "none";
      }
    });
  }, []);


  function showfirstprofile() {
    if (oncount < firstData.length) {
      setOncount(oncount + 1);
      setData(firstData[oncount]);
      setAge(getAge(firstData[oncount].dob));
      setDistancefromme(
        getDistanceFromLatLonInKm(
          firstData[oncount].location.coordinates[0],
          firstData[oncount].location.coordinates[1],
          mylocat[0],
          mylocat[1]
        ).toFixed(1)
      );
    }
  }

  function showprofile() {
    if (oncount < allData.length) {
      setData(allData[oncount]);
      setAge(getAge(allData[oncount].dob));
      var dist = getDistanceFromLatLonInKm(
        allData[oncount].location.coordinates[0],
        allData[oncount].location.coordinates[1],
        myloc[0],
        myloc[1]
      ).toFixed(1);

      setDistancefromme(dist);
    } else {
      document.getElementById("card_div").style.display = "none";
      document.getElementById("likebutton").style.display = "none";
      document.getElementById("dislikelikebutton").style.display = "none";
      document.getElementById("reportbutton").style.display = "none";
      document.getElementById("lastcard_div").style.display = "flex";
    }
  }
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  function getAge(dateString) {
    var birthString = dateString.split("-").reverse().join("-");
    var today = new Date();
    var birthDate = new Date(birthString);
    var userage = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      userage--;
    }
    return userage;
  }

  const handlelikebutton = () => {
    setIsToggled(!isToggled);
    showprofile();
    setOncount(oncount + 1);
    var likedData = {
      myid: cookies.userid,
      profileid: data.userid,
    };
    Axios.post("http://localhost:5000/api/postuserliked", { likedData }).then(
      (response) => {
        toast(`${response.data} 🦄`, {
          theme: "dark",
        });
      }
    );
  };

  // report button woking

  const handlereportbutton = () => {
    setIsToggled(!isToggled);
    showprofile();
    setOncount(oncount + 1);
    var reporteddata = {
      myid: cookies.userid,
      profileid: data.userid,
    };
    Axios.post("http://localhost:5000/api/reportuser", { reporteddata }).then(
      (response) => {
        toast(`${response.data} 🦄`, {
          theme: "dark",
        });
      }
    );
  };

  // dislike button woking

  const handlelikebutton2 = () => {
    setIsToggled2(!isToggled2);
    showprofile();
    setOncount(oncount + 1);
    var dislikedData = {
      myid: cookies.userid,
      profileid: data.userid,
    };
    Axios.post("http://localhost:5000/api/postuserdisliked", {
      dislikedData,
    }).then((response) => {});
  };

  return (
    <div className="Suggestions">
      <motion.div
        id="card_div"
        transition={{ layout: { duration: 1, type: "spring" } }}
        layout
        onClick={() => setIsOpen(!isOpen)}
        className="card"
      >
        <motion.div className="title">
          <img
            alt="profileimage"
            layout="position"
            className="profilephoto"
            src={`data:image/jpeg;base64,${data.img}`}
          />
          <motion.div className="names">
            <motion.h1 layout="position">{data.name}</motion.h1>
          </motion.div>
          <motion.div className="names">
            <motion.h3 className="distance" layout="position">
              {age} &nbsp;{" "}
            </motion.h3>
            <motion.h5 layout="position"> Years old</motion.h5>
          </motion.div>
          <motion.div className="names">
            <motion.h3 className="distance" layout="position">
              {" "}
              {distancefromme} &nbsp;
            </motion.h3>

            <motion.h5 layout="position"> Kms far from you</motion.h5>
          </motion.div>
        </motion.div>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="expand"
          >
            <motion.h3 layout="position">About Me</motion.h3>
            <motion.h5 layout="position"> {data.about}</motion.h5>
            <motion.h3 layout="position">My Passion</motion.h3>
            <motion.div className="details">
              {data.passion.map((object) => (
                <Tags Tagname={object} />
              ))}
            </motion.div>

            <motion.h3 layout="position">My Food Preference</motion.h3>
            <motion.div className="details">
              <Tags Tagname={data.foodpreferences} />
            </motion.div>

            <motion.h3 layout="position">My Drink of Choice</motion.h3>
            <motion.div className="details">
              <Tags Tagname={data.bestdrink} />
            </motion.div>
            <motion.h3 layout="position">Smoking ?</motion.h3>
            <motion.div className="details">
              <Tags Tagname={data.smoking} />
            </motion.div>
            <motion.h3 layout="position">Pets that I like</motion.h3>
            <motion.div className="details">
              {data.bestpets.map((object) => (
                <Tags Tagname={object} />
              ))}
            </motion.div>
          </motion.div>
        )}
      </motion.div>
      <ToastContainer />
      <button id="likebutton" className="button" onClick={handlelikebutton}>
        <img className="icons" src={require("./like.png")} />
      </button>
      {isToggled && (
        <img
          src="https://i.imgur.com/Zkwj970.png"
          alt="new"
          className="animation_like"
        />
      )}

      <button
        id="reportbutton"
        className="button3"
        onClick={handlereportbutton}
      >
        <img className="icons3" src={require("./ad.png")} />
      </button>
      {isToggled && (
        <img
          src="https://i.imgur.com/Zkwj970.png"
          alt="new"
          className="animation_like"
        />
      )}

      <button
        id="dislikelikebutton"
        className="button2"
        onClick={handlelikebutton2}
      >
        <img className="icons2" src={require("./thumb-down.png")} />
      </button>
      {isToggled2 && (
        <img
          src="https://i.imgur.com/XqQZ4KR.png"
          alt="new"
          className="animation_like"
        />
      )}

      <motion.div
        id="lastcard_div"
        transition={{ layout: { duration: 1, type: "spring" } }}
        layout
        onClick={() => setIsOpen(!isOpen)}
        className="lastcard"
      >
        <h1>Hello</h1>

        <h2>You are all caught up for now!</h2>

        <h2 className="buttonstonav">
          but you can always look <br></br>into events
        </h2>
      </motion.div>
    </div>
  );
};

export default Suggestions;
