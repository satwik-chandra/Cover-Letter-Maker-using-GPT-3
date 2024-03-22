import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../App.css';
import {query, getDocs, collection, orderBy, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { UserAuth } from '../firebase/AuthContext';
import AutoResizeTextArea from '../components/AutoResizeTextArea';
import { useNavigate } from 'react-router-dom';
import { saveNewCoverVersion } from '../firebase/Queries';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';


function Edit(props) {

    const location = useLocation();
    //console.log(" props", props);
    //console.log(" useLocation Hook", location);
    
    const [isEditing, setEditing] = useState(false);
    const [editedLetter, setEditedLetter] = useState('');
    var contentLetterToEdit = "";

    const navigate = useNavigate();

    const handleBackClick = () => {
    const confirm = window.confirm('Warning!!! If you go back you will be creating a new cover letter');
    if (confirm) {
      navigate('/newcover');
      window.location.reload();
    }
  };

  const [userFeedback, setUserFeedback] = useState('');
  const lettername = location.state?.data;
  

  const handleFeedbackChange = (event) => {
      setUserFeedback(event.target.value);
  };
    
    const [letter, setLetter] = useState("");
    const [letterID, setLetterID] = useState("");
    const [isWaitingApiResponse, setIsWaitingApiResponse] = useState(true);
    const { isLoading, user } = UserAuth();
    const destroyFunc = useRef();
    const effectCalled = useRef(false);
    const renderAfterCalled = useRef(false);
    const [val, setVal] = useState(0);
    const [web, setWeb] = useState(false);

    

    const [isGenerated, setIsGenerated] = useState(false);


    useEffect( ()=> {
      if (!effectCalled.current && !isLoading) { 
        destroyFunc.current = getAll();
        effectCalled.current = true;
      }
    }, [isLoading, letter, letterID]);

    //var  url = 'http://localhost:3001/?name=' + name + '&email=' + email + '&phoneNumber=' + phone + '&pastRoles=' + roles + '&pastProjects=' + projects + '&pastCompanies=' + employers + '&company='+ company + '&job='+ title;
    //var url = 'http://localhost:3001/random';
    //var url = 'https://coverlettermaker.herokuapp.com/'
    //console.log('url', url);

    async function fetchFBdataurl() {
      if (isLoading) {
        return;
      }
      
      //variable to contain the most recent cover letter
      let recent_cover_letter = "";
      //variable containing the all the cover letters in an ascending order
      const covers = [];
      //variable containing the feedback by the user, seperated by commas
      let feedback = "";
      const coversRef = collection(db, `users/${user.uid}/covers/`);
      const q = query(coversRef, orderBy("last_update", "desc"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        covers.push(
          {id: doc.id, title: doc.data().title, content: doc.data().content}
        )

        //console.log(doc.id, " => ", doc.data());
      })
      console.log(covers);
      
      //get the most recent cover letter from database and store it in recent_cover_letter
      recent_cover_letter = covers[0]
      console.log(recent_cover_letter)
      return recent_cover_letter;
    } 

  
  const getAll = async () => {
    const recent_cover_letter = await fetchFBdataurl();
    setLetter(recent_cover_letter.content);
    setLetterID(recent_cover_letter.id);
    setIsWaitingApiResponse(false)
    return
  };

  const handleSave = (newContent) => {
    setEditedLetter(newContent);
  };
  
  const saveEditedLetter = async () => {    
    saveNewCoverVersion(user.uid, letterID, editedLetter);
    setLetter(editedLetter);
    setEditing(false);
  };
      
      return (
        <div>
        {isWaitingApiResponse ? (
          <div className="loader-container">
            <span className="spinner-text">Loading</span>
            <div className="spinner"></div>
          </div>
        ) : (
          <div>
            <div className='page-title'>
              <h1>{lettername}</h1>
            </div>
            {isEditing ? (
                    <div>
                        <AutoResizeTextArea
                            content={letter.replace(/\\n/g, "\n").replace(/"/g, "")}
                            saveContent={handleSave}
                        />
                        <button className='pastcovers-button cancel' onClick={() => setEditing(false)}>Cancel</button>
                        <button className='pastcovers-button save' onClick={saveEditedLetter}>Save</button>

                    </div>
                ) : (
                    <div>
                      <div>
                        <pre className={web?"cover-letter":"cover-letter mob"}>{typeof letter === "string" ? letter.replace(/\\n/g, "\n").replace(/"/g, "") : letter}</pre>
                      </div>
                      <div >
                        <button className='secondary-button' onClick={() => setEditing(true)}>Edit</button>
                        <Link to="/"  className="donelink">Done</Link>
                      </div>
                    </div>
                )}
          </div>
        )}
      </div>
      );


  }
  
  export default Edit;