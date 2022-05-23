
import   React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Login from "./Pages/Users/Login";
import NotFound from "./Pages/NotFound";
import Register from "./Pages/Users/Register";


function App() {
  return (
      <div className="App">
        <Router>
          <div>
            <Routes>
                <Route path="/users/login" element={<Login/>}/>
                <Route path="/users/register" element={<Register/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
          </div>
        </Router>
      </div>
  );
}

export default App