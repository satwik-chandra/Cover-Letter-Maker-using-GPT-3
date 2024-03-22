import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../App.css';
import { collection, addDoc, setDoc, doc, query, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { UserAuth } from '../firebase/AuthContext';
import AutoResizeTextArea from '../components/AutoResizeTextArea';
import { useNavigate } from 'react-router-dom';
import { saveNewCoverVersion } from '../firebase/Queries';
import CoverDisplay from '../components/CoverDisplay';




function Output(props) {
    const location = useLocation();
    //console.log(" props", props);
    //console.log(" useLocation Hook", location);
    
    const [isEditing, setEditing] = useState(false);
    const [editedLetter, setEditedLetter] = useState('');
    var contentLetterToEdit = "";

    const navigate = useNavigate();

    const lettername = location.state?.data;

    const [letterContent, setLetterContent] = useState([]);
    const [isWaitingApiResponse, setIsWaitingApiResponse] = useState(true);
    const { isLoading, user } = UserAuth();
    const destroyFunc = useRef();
    const effectCalled = useRef(false);
    const renderAfterCalled = useRef(false);
    const [val, setVal] = useState(0);
    const [storedLetterCoverId, setStoredLetterCoverId] = useState("");
    

    if (effectCalled.current) {
        renderAfterCalled.current = true;
    }

    useEffect( ()=> {
      // only execute the effect first time around
      if (!effectCalled.current && !isLoading) { 
        destroyFunc.current = getAll();
        effectCalled.current = true;
      }

      // this forces one render after the effect is run
      setVal(val => val + 1);

      return ()=> {
        // if the comp didn't render since the useEffect was called,
        // we know it's the dummy React cycle
        if (!renderAfterCalled.current) { return; }
      };
    }, [isLoading]);

    //var  url = 'http://localhost:3001/?name=' + name + '&email=' + email + '&phoneNumber=' + phone + '&pastRoles=' + roles + '&pastProjects=' + projects + '&pastCompanies=' + employers + '&company='+ company + '&job='+ title;
    //var url = 'http://localhost:3001/random';
    //var url = 'https://coverlettermaker.herokuapp.com/'
    //console.log('url', url);
    async function fetchFBdataurl() {
      if (isLoading) {
        return;
      }
      let name = ""
      let email = ""
      let phone = ""
      let roles = ""
      let projects = ""
      let employers = ""
      let title = ""
      let company = ""
      let description = ""
      let universities = ""
      let majors = ""
      let degrees = ""
      let gpas = ""
      let years = ""
      let skills = ""

      const q = query(collection(db, `users/${user.uid}/personaldata`));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if(doc.id == 'personal'){
          if(doc.data()['name']){
            name = encodeURI(doc.data()['name'])
          }
          if(doc.data()['phone']){
            phone = encodeURI(doc.data()['phone'])
          }
          if(doc.data()['email']){
            email = encodeURI(doc.data()['email'])
            console.log("EMAIL", email)
          }
        }
        if(doc.id == 'experience'){
          if(doc.data()['roles']){
            roles = encodeURI(doc.data()['roles'])
          }
          if(doc.data()['employers']){
            employers = encodeURI(doc.data()['employers'])
          }
          if(doc.data()['projects']){
            projects = encodeURI(doc.data()['projects'])
          }
        }  
        if(doc.id == 'jobinfo'){
          if(doc.data()['title']){
            title = encodeURI(doc.data()['title'])
          }
          if(doc.data()['company']){
            company = encodeURI(doc.data()['company'])
          }
          if(doc.data()['description']){
            description = encodeURI(doc.data()['description'])
          }
        }
        if(doc.id == 'education'){
          if(doc.data()['universities']){
            universities = encodeURI(doc.data()['universities'])
          }
          if(doc.data()['majors']){
            majors = encodeURI(doc.data()['majors'])
          }
          if(doc.data()['degrees']){
            degrees = encodeURI(doc.data()['degrees'])
          }
          if(doc.data()['gpas']){
            gpas = encodeURI(doc.data()['gpas'])
          }
          if(doc.data()['years']){
            years = encodeURI(doc.data()['years'])
          }
        }
        if(doc.id == 'skills'){
          if(doc.data()['skills']){
            skills = encodeURI(doc.data()['skills'])
          }
        }
        console.log(doc.id, " => ", doc.data());
      });

      //let url = 'https://coverlettermaker.herokuapp.com/generate?name=' + name + '&email=' + email + '&phoneNumber=' + phone + '&degrees=' + degrees + '&universities=' + universities + '&major=' + majors + '&gpa=' + gpas + '&graduationYear=' + years + '&pastRoles=' + roles + '&pastProjects=' + projects + '&pastCompanies=' + employers + '&skills=' + skills + '&company='+ company + '&job='+ title + '&job_description=' + description
      let url = 'http://localhost:3001/generate/?name=' + name + '&email=' + email + '&phoneNumber=' + phone + '&degrees=' + degrees + '&universities=' + universities + '&major=' + majors + '&gpa=' + gpas + '&graduationYear=' + years + '&pastRoles=' + roles + '&pastProjects=' + projects + '&pastCompanies=' + employers + '&skills=' + skills + '&company='+ company + '&job='+ title + '&job_description=' + description
         
      return url
    } 

    const getAll = async () => {
      const urlResult = await fetchFBdataurl();
      console.log(urlResult)
      return axios.get(urlResult, {})
      .then(function (response) {
        console.log(response.data);
        const content = response.data.replace(/\\n/g, "\n").replace(/"/g, "");
        setLetterContent(content);
        setIsWaitingApiResponse(false);
        return content;
      })
      .then(async (data) => {
        const myTitle = await checkTitleRedundancy(lettername);
        //const myTitle = "TMP title";
        const myContent = data;
        const myTimestamp = new Date().getTime();
        const collectionRef = collection(db, `users/${user.uid}/covers`);
        const newDocRef = await addDoc(collectionRef, {
          title: myTitle,
          last_update: myTimestamp,
          content: myContent
        });

        setStoredLetterCoverId(newDocRef.id);

        // add the content as a new document in collection versions
        const contentRef = collection(db, `users/${user.uid}/covers/${newDocRef.id}/versions`)
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
        saveNewCoverVersion(user.uid, storedLetterCoverId, contentLetterToEdit);
        setLetterContent(contentLetterToEdit);
        setEditing(false);
      };
      
    return (
      <div>
        {
          isWaitingApiResponse ? (
            <div className='loader-container'>
              <span className='spinner-text'>Loading</span>
              <div className="spinner"></div>
            </div>
          ) : (
            <div>
                <CoverDisplay userId={user.uid} coverId={storedLetterCoverId} letterTitle={lettername} letterContent={letterContent}></CoverDisplay>
            </div>
        )}
    </div>
);


  }
  
  export default Output;