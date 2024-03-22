import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component} from 'react';
import { useLocation } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Progress from '../components/Progress';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, setDoc, getDocs, doc} from 'firebase/firestore';
import { UserAuth } from '../firebase/AuthContext';
import { db } from "../firebase/firebase"

function Education() {
    async function setsEducationValue(valueU, valueD, valueM, valueG, valueY){
      setfbUni(valueU)
      setfbDegree(valueD)
      setfbMajor(valueM)
      setfbGPA(valueG)
      setfbYear(valueY)
      const collectionRef = doc(db, `users/${user.uid}/personaldata`, 'education');
      await setDoc(collectionRef, {
        universities: valueU,
        degrees: valueD,
        majors: valueM,
        gpas: valueG,
        years: valueY
      });
      console.log('set', {
        universities: valueU,
        degrees: valueD,
        majors: valueM,
        gpas: valueG,
        years: valueY
      })
    }

    const [fbUnis, setfbUni] = useState('');
    const [fbDegree, setfbDegree] = useState('');
    const [fbMajor, setfbMajor] = useState('');
    const [fbGPA, setfbGPA] = useState('');
    const [fbYear, setfbYear] = useState('');
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
          if(doc.id == 'education'){
            if(doc.data()['universities']){
              setfbUni(doc.data()['universities']);
            }
            if(doc.data()['degrees']){
              setfbDegree(doc.data()['degrees']);
            }
            if(doc.data()['majors']){
              setfbMajor(doc.data()['majors']);
            }
            if(doc.data()['gpas']){
              setfbGPA(doc.data()['gpas']);
            }
            if(doc.data()['years']){
              setfbYear(doc.data()['years']);
            }
            if(doc.data()['universities']){
              const uniresult = doc.data()['universities'].split(', ');
              const degreeresult = doc.data()['majors'].split(', ');
              const majorresult = doc.data()['degrees'].split(', ');
              const gparesult = doc.data()['gpas'].split(', ');
              const yearresult = doc.data()['years'].split(', ');
              console.log('concated', uniresult, degreeresult, majorresult, gparesult)

              let data = []
              for(var i = 0; i < uniresult.length; i++){
                let object = {
                  uni: uniresult[i],
                  degree: degreeresult[i],
                  major: majorresult[i],
                  gpa: gparesult[i],
                  year: yearresult[i]
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
      { uni: '',
        degree: '',
        major: '',
        gpa: '',
        year: ''},
    ])
  

    const handleFormChange = (event, index) => {
      let data = [...formFields];
      data[index][event.target.name] = event.target.value;
      setFormFields(data);
      concat(data);
    }


    const addFields = () => {
      let object = { uni: '',
        degree: '',
        major: '',
        gpa: '',
        year: ''}
      setFormFields([...formFields, object])
    }

    const removeFields = (index) => {
      let data = [...formFields];
      data.splice(index, 1)
      setFormFields(data)
      concat(data)
    }

    const concat = (data) => {
      const result1 = data.map((x) => (x.uni)).join(', ');
      const result2 = data.map((x) => (x.degree)).join(', ');
      const result3 = data.map((x) => (x.major)).join(', ');
      const result4 = data.map((x) => (x.gpa)).join(', ');
      const result5 = data.map((x) => (x.year)).join(', ');
      setsEducationValue(result1,result2,result3,result4,result5)
    }

    useEffect(()=>{
      if(navigator.userAgent.includes('Mac')&&!navigator.userAgent.includes('iPhone')||navigator.userAgent.includes('Windows')){
        setWeb(true)
      }
      },[])

    return (
      <div className={web?"new-cover-pages":"new-cover-pages mob2"}>
        <script>fetchFBdata()</script>
        <h1>Education</h1>
        <Progress size={32}/>    
          <div className='Form'>
            <Form>
              <Form.Label>List your degrees:</Form.Label>
              {formFields.map((form, index) => {
                return (
                  <div key={index}>
                    <div className='card-form'>
                      <Card>
                        <Card.Body>
                          <Row className='row'>
                            <Col>
                              <Form.Control name='uni'
                                placeholder='University Name'
                                onChange={event => handleFormChange(event, index)}
                                value={form.uni}/>
                            </Col>
                            
                          </Row>
                          <Row>
                            <Col>
                              <Form.Control name='degree'
                                  placeholder='Degree Title'
                                  onChange={event => handleFormChange(event, index)}
                                  value={form.degree}/>
                            </Col>
                            <Col>
                            <Form.Control name='major'
                                placeholder='Major'
                                onChange={event => handleFormChange(event, index)}
                                value={form.major}/>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <Form.Control name='year'
                                  placeholder='Year of Graduation'
                                  onChange={event => handleFormChange(event, index)}
                                  value={form.year}/>
                            </Col>
                            <Col>
                              <Form.Control name='gpa'
                                  placeholder='GPA'
                                  onChange={event => handleFormChange(event, index)}
                                  value={form.gpa}/>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <div className="center-button">
                                <Button  onClick={() => removeFields(index)}>Remove</Button>
                              </div>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </div>
                    <br></br>
                  </div>
                )
              })}
            </Form>
          </div>
          <div className='Form'>
            {formFields.length < 2 &&
              <Button onClick={addFields}>Add More</Button>
            }
            <br></br>
            <br></br>
            <Link to="/experience"  state={{ data: [] }} className="nextlink">CONTINUE</Link>
          </div>

      </div>
    );
  }
  
  export default Education;