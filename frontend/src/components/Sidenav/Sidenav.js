// import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Event from './Event/Event';
import './Sidenav.css';
import { Avatar } from '@mui/material';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import Profile from '../Profile/Profile';
import axios from "axios";
import React, { useState, useEffect } from "react";
import Chat from '../Chat/Chat'
import { useCookies } from "react-cookie";

function TabPanel(props) {
  const { children, value, index, ...other } = props;


  

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div>
          <Typography component={'span'}>{children}</Typography>
        </div>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(1);
  const [cookies] = useCookies([]);
  const [image, setImage] = useState();
  
  var userId = {
    myid: cookies.userid
  }
  useEffect(() => {
    async function getmypicture(){
       await axios.get('http://localhost:5000/api/getmypicture/',{params: userId})
       .then((response) => {
         setImage(response.data);
       }).catch(()=> {
         console.log("picture not received");
       });
      }
      getmypicture();

}, [])

const handleChange = (event, newValue) => {
  setValue(newValue);
};
  return (
    <div className="sideNavContainer">
      <div className='sideNavTop'>
        <Tabs className='Tabs' value={value} onChange={handleChange}>
          <Tab className="sideNavAvatar" icon={<Avatar  alt="User profile" src={`data:image/jpeg;base64,${image}`}/>} {...a11yProps(0)} ></Tab>
          
          <Tab className="sideNavHeaderButtons"icon={<ManageSearchIcon fontSize="large" className="sidenavExplore"/>} {...a11yProps(1)} />
          <Tab className="sideNavHeaderButtons2"icon={<ChatOutlinedIcon fontSize="medium" className="sidenavChat"/>} {...a11yProps(2)} />
        </Tabs>
      </div>
      <TabPanel value={value} index={0}>
       <Profile/>
      </TabPanel>
      <TabPanel value={value} index={1}>
       <Event/>
      </TabPanel>
      <TabPanel value={value} index={2}>
       <Chat/>
      </TabPanel>
    </div>
  );
}
