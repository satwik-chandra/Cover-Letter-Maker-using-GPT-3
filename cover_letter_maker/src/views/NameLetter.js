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

function NameLetter() {

    const [letterNameValue, setLetterNameValue] = useState('');

    const checkFormFilled = (event) => {
      if (!letterNameValue) {
        event.preventDefault();
        alert("Please fill in all fields before navigating to another page.");
      }
    };

    return (
      <div className="new-cover-pages">
        <h1>Name your cover letter</h1>
        <Progress size={99}/>
        <div className='Form'>
          <Form>
            <Form.Group className="mb-3" value={letterNameValue} onChange={e => setLetterNameValue(e.target.value)}>
              <Form.Label>What do you want to name this coverletter?</Form.Label>
              <Form.Control type="text" placeholder="My Cover Letter" />
            </Form.Group>
            
          </Form>
          <br></br>
          <script>console.log(data)</script>
          
          <Link to="/output" state={{ data: letterNameValue }} className="nextlink" onClick={checkFormFilled}>Generate single cover letter</Link>
          <Link to="/multipleoutput" state={{ data: letterNameValue }} onClick={checkFormFilled} className="nextlink mg1 multiple-gen-button">Generate multiple options</Link>
        </div>
      </div>
    );
  }
  
  export default NameLetter;