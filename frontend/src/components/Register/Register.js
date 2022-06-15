import "./Register.css";
import React,{useState,useEffect} from "react";
import {Link, useNavigate} from 'react-router-dom';
import { useCookies } from "react-cookie";
import {ToastContainer, toast} from 'react-toastify';
import Navbar from "../Navbar";
import axios from "axios";

export default function Register(){
    const [cookies] = useCookies(["cookie-name"]);
    const navigate = useNavigate();
    useEffect(() => {
        debugger
        if (cookies.jwt && cookies.jwt!=="undefined") {
          navigate("/signup");
        }
      }, [cookies, navigate]);
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
            password:values.password
        }
        const {data} = await axios.post("http://localhost:5000/api/register",{ userData},{
            withCredentials: true
        })
    
        if(data){
            if(data.errors){
                const { email, password } = data.errors;
                if(email) generateError(email);
                else if(password) generateError(password);
            }else{
                    navigate("/signup");
                }
        }
    } catch(err){ 
        console.log(err);
    }
};

const navbarLinks = [
    
    { url: "/", title: "Home" },
    
  ];


return ( 
    <div>
    <Navbar navbarLinks={navbarLinks} />
    <div className="registerBody">
        
        <div>
        <img className="photo" src={require('./dating.jpg')} />
        </div>
    <div className="registerContainer">
        <h2>Register Account</h2>
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
            <span>
                Already have an account? <Link to="/signin">Signin</Link>
            </span>
        </form>
        <ToastContainer/>
    </div> 
    </div>
    </div>
    );
}