import './App.css';
import Landing from './components/Landing/Landing'
import Admin from './components/Admin/Admin';
import SignUp from './components/SignUp/SignUp';
import ProfileDetails from './components/ProfileDetails/ProfileDetails';
import CoffeeDate from './components/Date/Date';
import Home from './components/Home/Home';
import Reports from './components/Reports/Reports';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Chat from './components/Chat/Chat'


export default function App(){
  return(
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Landing/>}/>
      <Route exact path="/register" element={<Register/>}/>
      <Route exact path="/signin" element={<Signin/>}/>
      <Route exact path="/signup" element={<SignUp/>}/>
      <Route exact path="/home" element={<Home/>}/>
      <Route exact path="/chat" element={<Chat/>}/>
      <Route exact path="/coffeedate" element={<CoffeeDate/>}/>
      <Route exact path="/profile" element={<ProfileDetails/>}/>
      <Route exact path="/admin" element={<Admin/>}/>
      <Route exact path="/reports" element={<Reports/>}/>
    </Routes>
  </BrowserRouter>
  );
}

