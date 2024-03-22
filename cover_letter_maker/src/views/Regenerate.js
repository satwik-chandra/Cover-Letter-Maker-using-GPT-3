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


function Regenerate(props) {
    const location = useLocation();
    //console.log(" props", props);
    //console.log(" useLocation Hook", location);
    
    const [isEditing, setEditing] = useState(false);
    const [editedLetter, setEditedLetter] = useState('');
    const [web, setWeb] = useState(false);
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

  const handleFeedbackChange = (event) => {
      setUserFeedback(event.target.value);
  };

    const {letterName, letterContent} = location.state;

    const [letter, setLetter] = useState([]);
    const [isWaitingApiResponse, setIsWaitingApiResponse] = useState(false);
    const { isLoading, user } = UserAuth();
    const destroyFunc = useRef();
    const effectCalled = useRef(false);
    const renderAfterCalled = useRef(false);
    const [val, setVal] = useState(0);
    const coverDocId = useRef("");
    

    const [isGenerating, setIsGenerating] = useState(false);

    if (effectCalled.current) {
        renderAfterCalled.current = true;
    }

    useEffect( ()=> {
      console.log("Name : " + letterName);
      console.log("Content : " + letterContent);
    }, [isLoading]);

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

        console.log(doc.id, " => ", doc.data());
      })
      console.log(covers);
      
      //get the most recent cover letter from database and store it in recent_cover_letter
      recent_cover_letter = covers[0].content;

      //get the feedback from the user and store it in feedback
      //For testing: Use the local host url
      let  url = 'http://localhost:3001/regenerate?cover_letter=' + encodeURIComponent(recent_cover_letter) + '&feedback=' + encodeURIComponent(userFeedback);
      
      //For production: Use the heroku url
      //let url = 'https://coverlettermaker.herokuapp.com/regenerate?cover_letter=' + encodeURIComponent(recent_cover_letter) + '&feedback=' + encodeURIComponent(userFeedback);
      
      console.log(url)
      return url
    } 

    const getAll = async () => {
      setIsGenerating(true);
      const urlResult = await fetchFBdataurl();
      console.log(urlResult)
      return axios.get(urlResult, {})
      .then(function (response) {
        console.log(response.data);
        setLetter(response.data);
        setIsWaitingApiResponse(false);
        return response.data;
      })
      .then(async (data) => {
        const myTitle = await checkTitleRedundancy(letterName);
        //const myTitle = "TMP title";
        const myContent = data.replace(/\\n/g, "\n").replace(/"/g, "");
        const myTimestamp = new Date().getTime();
        const collectionRef = collection(db, `users/${user.uid}/covers`);
        const newDocRef = await addDoc(collectionRef, {
          title: myTitle,
          last_update: myTimestamp,
          content: myContent
        });

        coverDocId.current = newDocRef.id;

        // add the content as a new document in collection versions
        const contentRef = collection(db, `users/${user.uid}/covers/${coverDocId.current}/versions`)
        const newDocVersionRef = await addDoc(contentRef, {
          content: myContent,
          timestamp: myTimestamp
        });
        console.log("New cover letter stored with ID: ", newDocVersionRef.id);
      });
    }

      const checkTitleRedundancy = async (title) => {
        // get titles from firebase
        const allTitles = [];
        const coversRef = collection(db, `users/${user.uid}/covers`);
        const q = query(coversRef);
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          allTitles.push(doc.data().title);
        })

        // Compare fetched title with the current one
        var titleNumber = 1;
        var newTitle = title;
        var end = false;

        while (!end) {
          end = allTitles.every(storedTitle => {
            if (newTitle === storedTitle) {
              newTitle = title + ` (${titleNumber})`;
              titleNumber++;
              return false;
            }
            return true;
          })
        }
        
        return newTitle;
      };

      const handleSave = (newContent) => {
        contentLetterToEdit = newContent;
      };

      const saveEditedLetter = async () => {    
        saveNewCoverVersion(user.uid, coverDocId.current, contentLetterToEdit);
        setLetter(contentLetterToEdit);
        setEditing(false);
      };
      useEffect(()=>{
        if(navigator.userAgent.includes('Mac')&&!navigator.userAgent.includes('iPhone')||navigator.userAgent.includes('Windows')){
          setWeb(true)
        }
        },[])
      
      return (
        <div>
        {(isWaitingApiResponse || isGenerating) ? (
          <div className={web?'loader-container':"loader-container mob"}>
            <span className="spinner-text">Loading</span>
            <div className="spinner"></div>
          </div>
        ) : (
          <div>
            <div className='page-title'>
              <h1>{letterName}</h1>
            </div>
            <pre className={web?"cover-letter":"cover-letter mob"}>
              {typeof letter === "string"
                ? letter.replace(/\\n/g, "\n").replace(/"/g, "")
                : letter}
            </pre>
            <div>
              <Form>
                <Form.Group className="mb-3" controlId="feedback">
                  <Form.Label>Feedback:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={userFeedback}
                    onChange={handleFeedbackChange}
                  />
                </Form.Group>
              </Form>
            </div>
            <Button variant="primary" onClick={() => getAll()}>
              Regenerate
            </Button>
            <Link to="/"  className="donelink">Done</Link>
          </div>
        )}
      </div>
      );


  }
  
  export default Regenerate;