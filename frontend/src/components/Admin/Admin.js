import React from 'react'
import Axios from "axios";
import './Admin.css';
import Box from '@mui/material/Box';

import {useState,useEffect} from "react";
import {Link, useNavigate} from 'react-router-dom';
import { useCookies } from "react-cookie";
import {ToastContainer, toast} from 'react-toastify';

import axios from "axios";

import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import CRUDTable, {
  Fields,
  Field,
  Pagination,
//   UpdateForm,
  DeleteForm
} from "react-crud-table";
const Admin = () => {
    var tasks=[];
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };
    const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
    async function fetchData(){
            await Axios.get('http://localhost:5000/api/getallusers').then((response)=>{
                tasks=[]
                    response.data.forEach(element => {
                        var tempData={id:Number,email:String,isAdmin:String};
                        tempData.id = element._id;
                        tempData.email = element.email
                        tempData.isAdmin = (String)(element.isAdmin)
                        tasks.push(tempData)
                    });
                            });
            }
      
      const SORTERS = {
        NUMBER_ASCENDING: mapper => (a, b) => mapper(a) - mapper(b),
        NUMBER_DESCENDING: mapper => (a, b) => mapper(b) - mapper(a),
        STRING_ASCENDING: mapper => (a, b) => mapper(a).localeCompare(mapper(b)),
        STRING_DESCENDING: mapper => (a, b) => mapper(b).localeCompare(mapper(a)),
      };
      
      const getSorter = (data) => {
        const mapper = x => x[data.field];
        let sorter = SORTERS.STRING_ASCENDING(mapper);
        sorter = data.direction === 'ascending' ?
        SORTERS.STRING_ASCENDING(mapper) : SORTERS.STRING_DESCENDING(mapper);
      
        return sorter;
      };

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
      const [values,setValues] = useState({
          email:"",
          password:"",
      });
      //handle errors
      const generateError = (err) => toast.error(err, {
          position: "bottom-right",
      });
  
  
  //prevent form submission
  //calling API : try/catch
  //{data} : will be destructured from the axios response
  const handleSubmit = async(e) => {
      e.preventDefault();
      try{
          var userData ={
              email:values.email,
              password:values.password,
              isAdmin:true
          }
          const {data} = await axios.post("http://localhost:5000/api/registeradmin",{ userData},{
              withCredentials: true
          })
      
          if(data){
              if(data.errors){
                  const { email, password } = data.errors;
                  if(email) generateError(email);
                  else if(password) generateError(password);
              }else{
                handleClose()
                  }
          }
      } catch(err){ 
          console.log(err);
      }
  };
      async function fetchItems(payload){
        await fetchData()
        const { activePage, itemsPerPage } = payload.pagination;
        const start = (activePage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        let result = Array.from(tasks);
        result = result.sort(getSorter(payload.sort));
        return Promise.resolve(result.slice(start, end));
    };
    async function fetchTotal(payload){
        await fetchData()
        return Promise.resolve(tasks.length);
    }
  async function deleteUser (data) {
        await Axios.post('http://localhost:5000/api/deleteuser',{ params: {myid:data.email} });
    };
      
      const styles = {
        container: { margin: 'auto', width: 'fit-content' },
      };
      const reportscreen = ()=>{
        navigate("/reports");
      }
  return (
    
    <div className="adminContainer">
    <div class="navBarAdmin">
   
    </div>
    <div style={styles.container}>
        <div className='addButtonDiv'>
        <div>
      <Button className="addAdmin" onClick={handleOpen}>Add Admin</Button>
      <Button className="adminReportButton" onClick={reportscreen}>Reports</Button>
    <Button className="adminLogout" onClick={logOut}>Log out</Button>
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
        
   
    <div className="registerContainer2">
        <h2>Register Admin</h2>
        <form onSubmit={(e)=>handleSubmit(e)}>
            <div>
                <label>Email</label>
                <input 
                type="email" 
                name="email" 
                placeholder="Email"
                onChange={(e)=>setValues({...values, [e.target.name]: e.target.value})}/> 
            </div> 
            <div>
                <label>Password</label>
                <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                onChange={(e)=>setValues({...values, [e.target.name]: e.target.value})}/>
            </div>
            <button className="submit" type="submit">Submit</button>
         
        </form>
        <ToastContainer/>
    </div> 
    </div>
    </div>
          </div>
        </Box>
      </Modal>
    </div>
        </div>
    
    <CRUDTable
      caption="Tasks"
      fetchItems={payload => fetchItems(payload)}
    >
      <Fields>
        <Field
          name="id"
          label="Id"
          hideInCreateForm
          readOnly
        />
        <Field
          name="email"
          label="Email"
          placeholder="Title"
        />
        <Field
          name="isAdmin"
          label="Admin"
          placeholder="Is Admin"
        />
      </Fields>
      <Pagination
        itemsPerPage={7}
        fetchTotalOfItems={payload => fetchTotal(payload)}
      />

      <DeleteForm
        title="Delete User"
        message="Are you sure you want to delete the user?"
        trigger="Delete"
        onSubmit={task => deleteUser(task)}
        submitText="Delete"
        validate={(values) => {
          const errors = {};
          if (!values.id) {
            errors.id = 'Please, provide id';
          }
          return errors;
        }}
      />
    </CRUDTable>
  </div>
    </div>
  )
}

export default Admin