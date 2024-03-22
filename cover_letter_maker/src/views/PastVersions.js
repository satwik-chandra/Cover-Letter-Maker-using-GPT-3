import { UserAuth } from "../firebase/AuthContext";
import React, { useEffect, Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import Versions from '../components/Versions'
import { useLocation } from "react-router-dom";

function PastVersions(props) {
  const location = useLocation();
  const coverID = encodeURI(location.state?.data.coverID);
  const coverTitle = location.state?.data.coverTitle;
  
  return (
    <div>
      <Versions  coverID={coverID} coverTitle={coverTitle}/>
    </div>
  );
}

export default PastVersions;
