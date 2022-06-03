
import React, {useState} from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Cookies from "js-cookie";

import Login from "./Pages/Users/Login";
import Register from "./Pages/Users/Register";
import Profile from "./Pages/Users/Profile";
import ViewAll from "./Pages/Auctions/ViewAll";
import NavBar from "./Components/NavBar/NabBar";
import EditUser from  "./Pages/Users/EditUser";
import EditUserImage from "./Pages/Users/EditUserImage";


function App() {


  return (
      <div className="App">
          <NavBar/>
        <Router>
          <div>
            <Routes>
                <Route path="/auctions" element={<ViewAll/>}/>
                <Route path="/users/login" element={<Login/>}/>
                <Route path="/users/register" element={<Register/>}/>
                <Route path="/users/:id" element={<Profile/>}/>
                <Route path="/users/edit/:id" element={<EditUser/>}/>
                <Route path="/users/edit/image/:id" element={<EditUserImage/>}/>
                <Route path="*" element={<ViewAll/>}/>
            </Routes>
          </div>
        </Router>
      </div>
  );
}

export default App