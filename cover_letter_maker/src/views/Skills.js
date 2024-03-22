import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import { useLocation } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Progress from '../components/Progress';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, setDoc, getDocs, doc} from 'firebase/firestore';
import { UserAuth } from '../firebase/AuthContext';
import { db } from "../firebase/firebase"

function Skills() {
  async function setSkillsValue(value){
      setfbSkills(value)
      const collectionRef = doc(db, `users/${user.uid}/personaldata`, 'skills');
      await setDoc(collectionRef, {
        skills: value
      });
    }


    const [fbSkills, setfbSkills] = useState('');
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
          if(doc.id == 'skills'){
            //setRoleFormFields
            if(doc.data()['skills']){
              setfbSkills(doc.data()['skills']);
              const result = doc.data()['skills'].split(', ');
              let data = []
              for(var i = 0; i < result.length; i++){
                let object = {
                  skill: result[i]
                }
                data = [...data, object]
              }
              setFormFields(data)
            }
          }
          console.log(doc.id, " => ", doc.data());
        });
      }
      fetchFBdata();
      
    }, [isLoading]);


    const [formFields, setFormFields] = useState([
      { skill: ''},
    ])

    const handleFormChange = (event, index) => {
      let data = [...formFields];
      data[index][event.target.name] = event.target.value;
      setFormFields(data);
      concat(data);
    }

    const addFields = () => {
      let object = {
        skill: ''
      }
      setFormFields([...formFields, object])
    }
    
    const removeFields = (index) => {
      let data = [...formFields];
      data.splice(index, 1)
      setFormFields(data)
      concat(data)
    }

    const concat = (data) => {
      const result = data.map((x) => (x.skill)).join(', ');
      setSkillsValue(result)
    }
    useEffect(()=>{
      if(navigator.userAgent.includes('Mac')&&!navigator.userAgent.includes('iPhone')||navigator.userAgent.includes('Windows')){
        setWeb(true)
      }
      },[])

      const checkFormFilled = (event) => {
        if (!fbSkills) {
          event.preventDefault();
          alert("Please fill in all fields before navigating to another page.");
        }
      };

    return (
      <div className={web?"new-cover-pages":"new-cover-pages mob"}>
        <script>fetchFBdata()</script>
        <h1>Skills</h1>
        <Progress size={65}/>    
        <div className='Form'>
          <Form>

            <Form.Label>List your skills:</Form.Label>
            {formFields.map((form, index) => {
              return (
                <div key={index}>
                  <Row className="row">
                    <Col>
                    <Form.Control name='skill'
                        placeholder='Brief skill description'
                        onChange={event => handleFormChange(event, index)}
                        value={form.skill}/>
                    </Col>
                    <Col xs="auto">
                      <Button onClick={() => removeFields(index)}>Remove</Button>
                    </Col>
                  </Row>
                </div>
              )
            })}
            {formFields.length < 4 &&
              <Button onClick={addFields}>Add More</Button>
            }
            <br/>
            <br/>
            <Form.Text className="text-muted">
              We reccomend listing the requirements you fufil from the job description as well as any other skills you may have.
            </Form.Text>
            
          </Form>
          <br/>
          <br/>
          <Link to="/jobinfo"  state={{ data: [] }} className="nextlink" onClick={checkFormFilled}>CONTINUE</Link>
        </div>
      </div>
    );
  }
  
  export default Skills;