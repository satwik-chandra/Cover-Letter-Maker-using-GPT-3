import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import React, { useState } from 'react';
import NewCover from './views/NewCover';
import PastCover from './views/PastCover';
import PastVersions from './views/PastVersions';
import Home from './views/Home';
import Experience from './views/Experience';
import JobInfo from './views/JobInfo';
import Output from './views/Output';
import Edit from './views/Edit';
import NameLetter from './views/NameLetter'
import NavBar from './components/NavBar';
import SignUp from './views/SignUp';
import SignIn from './views/SignIn';
import Education from './views/Education';
import Skills from './views/Skills';
import { AuthContextProvider } from './firebase/AuthContext';
import ProtectedRoute from './firebase/ProtectedRoute';
import UserProfile from './views/UserProfile';
import MultipleOutput from './views/MultipleOutput';
import Regenerate from './views/Regenerate';
import ProfileInfo from './views/ProfileInfo';

function App() {
  const [colorScheme, setColorScheme] = useState('light'); // default color scheme is light

  const handleColorSchemeChange = () => {
    setColorScheme(colorScheme === 'light' ? 'dark' : 'light'); // toggle between light and dark
  }

  return (
    <div className={`App-${colorScheme}`}>
      <AuthContextProvider>
        <NavBar onColorSchemeChange={handleColorSchemeChange} colorScheme={colorScheme} />
        <div>
            <Router>
                <Routes>
                  <Route exact path='/' element={<ProtectedRoute><Home colorScheme={colorScheme} /></ProtectedRoute>} />
                  <Route path='/newcover' element={<ProtectedRoute><NewCover colorScheme={colorScheme} /></ProtectedRoute>} />
                  <Route path='/pastcover' element={<ProtectedRoute><PastCover colorScheme={colorScheme} /></ProtectedRoute>} />
                  <Route path='/pastversions' element={<ProtectedRoute><PastVersions colorScheme={colorScheme} /></ProtectedRoute>} />
                  <Route path='/userprofile' element={<ProtectedRoute><UserProfile colorScheme={colorScheme} /></ProtectedRoute>} />
                  <Route path='/experience' element={<ProtectedRoute><Experience colorScheme={colorScheme} /></ProtectedRoute>} />
                  <Route path='/jobinfo' element={<ProtectedRoute><JobInfo colorScheme={colorScheme} /></ProtectedRoute>} />
                  <Route path='/education' element={<ProtectedRoute><Education colorScheme={colorScheme} /></ProtectedRoute>} />
                  <Route path='/skills' element={<ProtectedRoute><Skills colorScheme={colorScheme} /></ProtectedRoute>} />
                  <Route path='/nameletter' element={<ProtectedRoute><NameLetter colorScheme={colorScheme} /></ProtectedRoute>} />
                  <Route path='/output' element={<ProtectedRoute><Output colorScheme={colorScheme} /></ProtectedRoute>} />
                  <Route path='/edit' element={<ProtectedRoute><Edit colorScheme={colorScheme} /></ProtectedRoute>} />
                  <Route path='/regenerateoutput' element={<ProtectedRoute><Regenerate colorScheme={colorScheme} /></ProtectedRoute>} />
                  <Route path='/multipleoutput' element={<ProtectedRoute><MultipleOutput colorScheme={colorScheme} /></ProtectedRoute>} />
                  <Route path='/signup' element={<SignUp />} />
                  <Route path='/profile-info' element={<ProtectedRoute><ProfileInfo colorScheme={colorScheme} /></ProtectedRoute>} />
                  <Route path='/signin' element={<SignIn />} />
                </Routes>
            </Router>
        </div>
      </AuthContextProvider>
    </div>
  );
}

export default App;
