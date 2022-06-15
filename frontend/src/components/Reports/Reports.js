import React from "react";
import Axios from "axios";
import "./Reports.css";
import { motion } from "framer-motion";
import "../Date/DateSuggestions/DateSuggestions.css";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import Tags from "../../Tags/Tags";
import axios from "axios";
import Modal from "@mui/material/Modal";
import CRUDTable, {
  Fields,
  Field,
  Pagination,
  UpdateForm,
  DeleteForm,
} from "react-crud-table";
const Admin = () => {
  var tasks = [];
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const [open, setOpen] = React.useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [age, setAge] = useState("");
  const [myloc, setMyloc] = useState("");
  const [distancefromme, setDistancefromme] = useState("");
  const [isToggled, setIsToggled] = useState(true);
  const [searchUserProfile, setSearchUserProfile] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  async function fetchData() {
    await Axios.get("http://localhost:5000/api/getreports").then((response) => {
      tasks = [];
      response.data.forEach((element) => {
        var tempData = { id: Number, userid: String, count: Number };
        tempData.id = element._id;
        tempData.userid = element.userid;
        tempData.count = String(element.count);
        tasks.push(tempData);
      });
    });
  }

  const SORTERS = {
    NUMBER_ASCENDING: (mapper) => (a, b) => mapper(a) - mapper(b),
    NUMBER_DESCENDING: (mapper) => (a, b) => mapper(b) - mapper(a),
    STRING_ASCENDING: (mapper) => (a, b) => mapper(a).localeCompare(mapper(b)),
    STRING_DESCENDING: (mapper) => (a, b) => mapper(b).localeCompare(mapper(a)),
  };

  const getSorter = (data) => {
    const mapper = (x) => x[data.field];
    let sorter = SORTERS.STRING_ASCENDING(mapper);
    sorter =
      data.direction === "ascending"
        ? SORTERS.STRING_ASCENDING(mapper)
        : SORTERS.STRING_DESCENDING(mapper);

    return sorter;
  };

  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);

  useEffect(() => {
    const verifyUser = async () => {
      if (!cookies.jwt) {
        console.log("jwt does not exist");
        navigate("/signin");
      } else {
        const { data } = await axios.post(
          "http://localhost:5000",
          { cookies },
          {
            withCredentials: true,
          }
        );
        if (!data.status) {
          removeCookie("jwt");
          removeCookie("userid");
          navigate("/signin");
          removeCookie("isAdmin");
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

  async function fetchItems(payload) {
    await fetchData();
    const { activePage, itemsPerPage } = payload.pagination;
    const start = (activePage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    let result = Array.from(tasks);
    result = result.sort(getSorter(payload.sort));
    return Promise.resolve(result.slice(start, end));
  }
  async function fetchTotal(payload) {
    await fetchData();
    return Promise.resolve(tasks.length);
  }
  async function deleteUser(data) {
    debugger
    await Axios.post("http://localhost:5000/api/deleteuser",{ params: {myid:data.userid} });
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
  const styles = {
    container: { margin: "auto", width: "fit-content" },
  };
  const reportscreen = () => {
    navigate("/admin");
  };

  const handleTypedText = async (e) => {
    e.preventDefault();
    setSearchUserProfile(e.target.value);
    Axios.get("http://localhost:5000/api/getuserprofilebyid", {
      params: e.target.value,
    }).then((response) => {
      debugger
      setAge(getAge(response.data.dob));
      setData(response.data);
    });
  };
  
  return (
    <div className="adminContainer">
      
    <div class="navBarAdmin2">
    <Button className="adminReportButton" onClick={reportscreen}>All users</Button>
    <Button className="adminLogout" onClick={logOut}>Log out</Button>
    </div>
    <div className="reportBody">
      <div style={styles.container}>
        <div className="addButtonDiv">
          <div>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <div>
                  <div>
                    <div className="registerBody2">
                      <div className="registerContainer2">card here</div>
                    </div>
                  </div>
                </div>
              </Box>
            </Modal>
          </div>
        </div>

        <CRUDTable
          caption="Reports"
          fetchItems={(payload) => fetchItems(payload)}

        >
          <Fields onClick="handleOpen">
            <Field name="userid" label="userid" placeholder="Title" />
            <Field name="count" label="Count" placeholder="Is Admin" />
          </Fields>
          <Pagination
            itemsPerPage={6}
            fetchTotalOfItems={(payload) => fetchTotal(payload)}
          />

          <DeleteForm
            title="Delete User"
            message="Are you sure you want to delete the user?"
            trigger="Delete"
            onSubmit={(task) => deleteUser(task)}
            submitText="Delete"
            validate={(values) => {
              const errors = {};
              if (!values.id) {
                errors.id = "Please, provide id";
              }
              return errors;
            }}
          />
        </CRUDTable>
      </div>
      <div id="reportedUserprofiles" className="reportedUserprofiles">
        <input
          className="reporteddata"
          value={searchUserProfile}
          placeholder="ENTER USER ID"
          onChange={handleTypedText}
          type="text"
        />

        <div className="profileCard">
          <motion.div
            id="card_div"
            transition={{ layout: { duration: 1, type: "spring" } }}
            layout
            onClick={() => setIsOpen(!isOpen)}
            className="cardProfile"
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
            </motion.div>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="expandReportProfile expand"
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
        </div>
      </div>
    </div>
    </div>
  );
};

export default Admin;
