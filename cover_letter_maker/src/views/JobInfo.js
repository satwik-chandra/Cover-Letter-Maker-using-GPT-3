import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import { useLocation } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Progress from '../components/Progress';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, setDoc, getDocs, doc} from 'firebase/firestore';
import { UserAuth } from '../firebase/AuthContext';
import { db } from "../firebase/firebase"

function JobInfo() {
  async function setTitleValue(value){
    setfbTitle(value)
    const collectionRef = doc(db, `users/${user.uid}/personaldata`, 'jobinfo');
    await setDoc(collectionRef, {
      title: value,
      company: fbCompany,
      description: fbDescription
    });
  }
  async function setCompanyValue(value){
    setfbCompany(value)
    const collectionRef = doc(db, `users/${user.uid}/personaldata`, 'jobinfo');
    await setDoc(collectionRef, {
      title: fbTitle,
      company: value,
      description: fbDescription
    });
  }
  async function setDescriptionValue(value){
    setfbDescription(value)
    const collectionRef = doc(db, `users/${user.uid}/personaldata`, 'jobinfo');
    await setDoc(collectionRef, {
      title: fbTitle,
      company: fbCompany,
      description: value
    });
  }
  const [fbTitle, setfbTitle] = useState('');
  const [fbCompany, setfbCompany] = useState('');
  const [fbDescription, setfbDescription] = useState('');
  const { user, isLoading } = UserAuth();
  const [web, setWeb] = useState(false);

  
  useEffect(() => {
    
    async function fetchFBdata() {
      if (isLoading) {
        return;
      }
      console.log(user.uid)
      const q = query(collection(db, `users/${user.uid}/personaldata`));

      const querySnapshot = await getDocs(q);
      console.log("query")
      querySnapshot.forEach((doc) => {
        if(doc.id == 'jobinfo'){
          if(doc.data()['title']){
            setfbTitle(doc.data()['title']);
          }
          if(doc.data()['company']){
            setfbCompany(doc.data()['company']);
          }
          if(doc.data()['description']){
            setfbDescription(doc.data()['description']);
          }
        }
        console.log(doc.id, " => ", doc.data());
      });
    }
    fetchFBdata();
    
  }, [isLoading]);
  useEffect(()=>{
    if(navigator.userAgent.includes('Mac')&&!navigator.userAgent.includes('iPhone')||navigator.userAgent.includes('Windows')){
      setWeb(true)
    }
    },[])
    const checkFormFilled = (event) => {
      if (!fbTitle || !fbCompany || !fbDescription) {
        event.preventDefault();
        alert("Please fill in all fields before navigating to another page.");
      }
    };
  return (
    <div className={web?"new-cover-pages":"new-cover-pages mob"}>
        <script>fetchFBdata()</script>
        <h1>Job Info</h1>
        <Progress size={84}/>
        <div className='Form'>
          <Form>
            <Form.Group className="mb-3" onChange={e => setTitleValue(e.target.value)}>
              <Form.Label>Job Title</Form.Label>
              <Form.Control type="text" placeholder="CEO" />
            </Form.Group>
            <Form.Group className="mb-3" onChange={e => setCompanyValue(e.target.value)}>
              <Form.Label>Company Name</Form.Label>
              <Form.Control type="name" placeholder="John and sons co." />
            </Form.Group>
            <Form.Group className="mb-3" onChange={e => setDescriptionValue(e.target.value)} controlId="exampleForm.ControlTextarea1">
              <Form.Label>Job Description</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
            
          </Form>
          <br></br>
          <Link to="/nameletter" state={{ data: [] }} className="nextlink" onClick={checkFormFilled}>CONTINUE</Link>
        </div>
      </div>
    );
  }
  
  export default JobInfo;