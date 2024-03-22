import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../App.css';
import { collection, addDoc, setDoc, doc, query, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { UserAuth } from '../firebase/AuthContext';
import { useNavigate } from 'react-router-dom';
import CoverDisplay from '../components/CoverDisplay';
import { saveNewCoverVersion, saveNewCover } from '../firebase/Queries';




function MultipleOutput(props) {
    const location = useLocation();

    const lettername = location.state?.data;
    const [letter1, setLetter1] = useState("");
    const [letter2, setLetter2] = useState("");
    const [isWaitingApiResponse1, setIsWaitingApiResponse1] = useState(true);
    const [isWaitingApiResponse2, setIsWaitingApiResponse2] = useState(true);
    const { isLoading, user } = UserAuth();
    const destroyFunc = useRef();
    const effectCalled = useRef(false);
    const renderAfterCalled = useRef(false);
    const [val, setVal] = useState(0);
    const [contentLetterSelected, setContentLetterSelected] = useState("");
    const [isLetterSelected, setIsLetterSelected] = useState(false);
    const [isWaitingForSave, setIsWaitingForSave] = useState(false);
    const [storedLetterCoverId, setStoredLetterCoverId] = useState("");
    

    const [isGenerated, setIsGenerated] = useState(false);
    const [web, setWeb] = useState(false);

    if (effectCalled.current) {
        renderAfterCalled.current = true;
    }

    useEffect( ()=> {
      console.log("TOTAL : " + isGenerated);
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

      //var url = 'http://localhost:3001/random';
      //let url = 'https://coverlettermaker.herokuapp.com/generate?name=' + name + '&email=' + email + '&phoneNumber=' + phone + '&degrees=' + degrees + '&universities=' + universities + '&major=' + majors + '&gpa=' + gpas + '&graduationYear=' + years + '&pastRoles=' + roles + '&pastProjects=' + projects + '&pastCompanies=' + employers + '&skills=' + skills + '&company='+ company + '&job='+ title + '&job_description=' + description
      let url = 'http://localhost:3001/generate/?name=' + name + '&email=' + email + '&phoneNumber=' + phone + '&degrees=' + degrees + '&universities=' + universities + '&major=' + majors + '&gpa=' + gpas + '&graduationYear=' + years + '&pastRoles=' + roles + '&pastProjects=' + projects + '&pastCompanies=' + employers + '&skills=' + skills + '&company='+ company + '&job='+ title + '&job_description=' + description
      console.log(url)
         
      return url
    } 

    const getAll = async () => {
      const urlResult = await fetchFBdataurl();
      console.log(urlResult);

      // call for letter 1
      axios.get(urlResult, {}).then(function (response) {
        console.log(response.data);
        setLetter1(response.data.replace(/\\n/g, "\n").replace(/"/g, ""));
        setIsWaitingApiResponse1(false);

        return response.data;
      });

      // call for letter 2
      axios.get(urlResult, {}).then(function (response) {
        console.log(response.data);
        setLetter2(response.data.replace(/\\n/g, "\n").replace(/"/g, ""));
        setIsWaitingApiResponse2(false);
        
        return response.data;
      });
    }

    const letterSelection = async (letterContent) => {
      setIsWaitingForSave(true);
      setContentLetterSelected(letterContent);
      let docId = await saveNewCover(user.uid, lettername, letterContent);
      setStoredLetterCoverId(docId)
      setIsLetterSelected(true);
      setIsWaitingForSave(false);
    };
    useEffect(()=>{
      if(navigator.userAgent.includes('Mac')&&!navigator.userAgent.includes('iPhone')||navigator.userAgent.includes('Windows')){
        setWeb(true)
      }
      },[])
      
    return (
      <div>
        {
          isWaitingApiResponse1 || isWaitingApiResponse2 || isWaitingForSave ? (
            <div className={web?'loader-container':"loader-container mob"}>
              <span className='spinner-text'>Loading</span>
              <div className="spinner"></div>
            </div>
          ) : (
            isLetterSelected ? (
              <CoverDisplay userId={user.uid} coverId={storedLetterCoverId} letterTitle={lettername} letterContent={contentLetterSelected}></CoverDisplay>
            ) : (
              <div className='multiple-output-container'>
                <h1>{"Select your prefered cover letter."}</h1>
                <div>
                  <pre className={web?"cover-letter":"cover-letter mob"} onClick={() => letterSelection(letter1)}>{letter1}</pre>
                  <pre className={web?"cover-letter":"cover-letter mob"} onClick={() => letterSelection(letter2)}>{letter2}</pre>
                </div>
              </div>
            )
        )}
      </div>
    );


  }
  
  export default MultipleOutput;