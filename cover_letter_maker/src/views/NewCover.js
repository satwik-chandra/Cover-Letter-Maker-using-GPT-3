import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Progress from '../components/Progress';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, query, setDoc, getDocs, doc} from 'firebase/firestore';
import { UserAuth } from '../firebase/AuthContext';
import { db } from "../firebase/firebase"

function NewCover() {

    async function setNameValue(value){
      setfbName(value)
      console.log('new value', value)
      const collectionRef = doc(db, `users/${user.uid}/personaldata`, 'personal');
      await setDoc(collectionRef, {
        name: value,
        phone: fbPhone,
        email: fbEmail
      });
    }
    async function setPhoneValue(value){
      setfbPhone(value)
      console.log('new value', value)
      const collectionRef = doc(db, `users/${user.uid}/personaldata`, 'personal');
      await setDoc(collectionRef, {
        name: fbName,
        phone: value,
        email: fbEmail
      });
    }
    async function setEmailValue(value){
      setfbEmail(value)
      console.log('new value', value)
      const collectionRef = doc(db, `users/${user.uid}/personaldata`, 'personal');
      await setDoc(collectionRef, {
        name: fbName,
        phone: fbPhone,
        email: value
      });
    }
    const [fbName, setfbName] = useState('');
    const [fbPhone, setfbPhone] = useState('');
    const [fbEmail, setfbEmail] = useState('');
    const { user, isLoading } = UserAuth();
    const [web, setWeb] = useState(false);

    async function resetJobinfo() {
      const collectionRef = doc(db, `users/${user.uid}/personaldata`, 'jobinfo');
      await setDoc(collectionRef, {
        title: "",
        company: "",
        description: ""
      });
    }
    useEffect(() => {
      resetJobinfo()
      
      async function fetchFBdata() {
        if (isLoading) {
          return;
        }
        console.log(user.uid)
        const q = query(collection(db, `users/${user.uid}/personaldata`));

        const querySnapshot = await getDocs(q);
        console.log("query")
        querySnapshot.forEach((doc) => {
          if(doc.id == 'personal'){
            if(doc.data()['name']){
              setfbName(doc.data()['name']);
            }
            if(doc.data()['phone']){
              setfbPhone(doc.data()['phone']);
            }
            if(doc.data()['email']){
              setfbEmail(doc.data()['email']);
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
        if (!fbName || !fbPhone || !fbEmail) {
          event.preventDefault();
          alert("Please fill in all fields before navigating to another page.");
        }
      };

    return (
      <div className={web?"new-cover-pages":"new-cover-pages mob"}>
        <script>fetchFBdata()</script>
        <h1>Personal Details</h1>
        <Progress size={16}/>
        
        <div className='Form'>
          <Form>
            <Form.Group className="mb-3" onChange={e => setNameValue(e.target.value)}>
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="name" placeholder="Jane Doe" defaultValue={fbName}/>
            </Form.Group>
            <Form.Group className="mb-3" onChange={e => setPhoneValue(e.target.value)}>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="phone" placeholder="+000 00 000 0000" defaultValue={fbPhone}/>
            </Form.Group>
            <Form.Group className="mb-3" onChange={e => setEmailValue(e.target.value)}>
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="name@example.com" defaultValue={fbEmail}/>
            </Form.Group>
            <br></br>
          </Form>
          <br></br>
          <Link to="/education" state={{ data: [] }} className="nextlink" onClick={checkFormFilled}>CONTINUE</Link>
        </div>
      </div>
    );
  }
  
  export default NewCover;