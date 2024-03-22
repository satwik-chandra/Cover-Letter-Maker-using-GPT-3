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

function Experience() {
    async function setRolesEmployersValue(valueR, valueE){
      setfbEmployers(valueE)
      setfbRoles(valueR)
      const collectionRef = doc(db, `users/${user.uid}/personaldata`, 'experience');
      await setDoc(collectionRef, {
        roles: valueR,
        employers: valueE,
        projects: fbProjects
      });
    }

    async function setProjectsValue(value){
      setfbProjects(value)
      console.log('new value', value)
      const collectionRef = doc(db, `users/${user.uid}/personaldata`, 'experience');
      await setDoc(collectionRef, {
        roles: fbRoles,
        employers: fbEmployers,
        projects: value
      });
    }

    const [fbRoles, setfbRoles] = useState('');
    const [fbEmployers, setfbEmployers] = useState('');
    const [fbProjects, setfbProjects] = useState('');
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
          if(doc.id == 'experience'){
            if(doc.data()['roles']){
              setfbRoles(doc.data()['roles']);
            }
            if(doc.data()['employers']){
              setfbEmployers(doc.data()['employers']);
            }
            if(doc.data()['roles'] && doc.data()['employers']){
              console.log('here')
              const rolesresult = doc.data()['roles'].split(', ');
              const companyresult = doc.data()['employers'].split(', ');
              console.log('pair', rolesresult, companyresult)

              let data = []
              for(var i = 0; i < rolesresult.length; i++){
                let object = {
                  role: rolesresult[i],
                  company: companyresult[i]
                }
                data = [...data, object]
              }
              setRoleFormFields(data)
            }
            console.log(fbRoles);
            console.log(fbEmployers);
            //setRoleFormFields
            if(doc.data()['projects']){
              setfbProjects(doc.data()['projects']);
              const result = doc.data()['projects'].split(', ');
              let data = []
              for(var i = 0; i < result.length; i++){
                let object = {
                  project: result[i]
                }
                data = [...data, object]
              }
              setProjectFormFields(data)
            }
          }
          console.log(doc.id, " => ", doc.data());
        });
      }
      fetchFBdata();
      
    }, [isLoading]);

    const [formRoleFields, setRoleFormFields] = useState([
      { role: '',
        company: ''},
    ])
  
    const [formProjectFields, setProjectFormFields] = useState([
      { project: ''},
    ])

    const handleRoleFormChange = (event, index) => {
      let data = [...formRoleFields];
      data[index][event.target.name] = event.target.value;
      setRoleFormFields(data);
      console.log(data);
      concatRoleEmployers(data);
    }

    const handleProjectFormChange = (event, index) => {
      let data = [...formProjectFields];
      data[index][event.target.name] = event.target.value;
      setProjectFormFields(data);
      concatProject(data);
    }

    const addRoleCompanyFields = () => {
      let object = {
        role: '',
        company: ''
      }
      setRoleFormFields([...formRoleFields, object])
    }

    const addProjectFields = () => {
      let object = {
        project: ''
      }
      setProjectFormFields([...formProjectFields, object])
    }
    
    const removeRoleFields = (index) => {
      let data = [...formRoleFields];
      data.splice(index, 1)
      setRoleFormFields(data)
      concatRoleEmployers(data)
    }
    const removeProjectFields = (index) => {
      let data = [...formProjectFields];
      data.splice(index, 1)
      setProjectFormFields(data)
      concatProject(data)
    }
    const concatRoleEmployers = (data) => {
      const result1 = data.map((x) => (x.role)).join(', ');
      const result2 = data.map((x) => (x.company)).join(', ');
      setRolesEmployersValue(result1,result2)
    }

    const concatProject = (data) => {
      const result = data.map((x) => (x.project)).join(', ');
      setProjectsValue(result)
    }
    useEffect(()=>{
      if(navigator.userAgent.includes('Mac')&&!navigator.userAgent.includes('iPhone')||navigator.userAgent.includes('Windows')){
        setWeb(true)
      }
      },[])
      const checkFormFilled = (event) => {
        if (!fbRoles || !fbEmployers || !fbProjects) {
          event.preventDefault();
          alert("Please fill in all fields before navigating to another page.");
        }
      };
    return (
      <div className={web?"new-cover-pages":"new-cover-pages mob"}>
        <script>fetchFBdata()</script>
        <h1>Experience</h1>
        <Progress size={49}/>    
        <br />
        <div className='Form'>
          <Form>
            <Form.Label>List your key past roles and companies:</Form.Label>
            {formRoleFields.map((form, index) => {
              return (
                <div key={index}>
                  <Row className='row'>
                    <Col xs={14} sm={6}>
                      <Form.Control name='role'
                        placeholder='Role'
                        onChange={event => handleRoleFormChange(event, index)}
                        value={form.role}/>
                    </Col>
                    <Col>
                    <Form.Control name='company'
                        placeholder='Company'
                        onChange={event => handleRoleFormChange(event, index)}
                        value={form.company}/>
                    </Col>
                    <Col xs="auto">
                      <Button onClick={() => removeRoleFields(index)}>Remove</Button>
                    </Col>
                  </Row>
                </div>
              )
            })}
            <Button onClick={addRoleCompanyFields}>Add More</Button>
            <br></br>
            <br></br>
            <br></br>
            <Form.Label>List your key past projects:</Form.Label>
            {formProjectFields.map((form, index) => {
              return (
                <div key={index}>
                  <Row className='row'>
                    <Col xs={10} sm={6}>
                    <Form.Control name='project'
                        placeholder='Brief project description'
                        onChange={event => handleProjectFormChange(event, index)}
                        value={form.project}/>
                    </Col>
                    <Col>
                      <Button onClick={() => removeProjectFields(index)}>Remove</Button>
                    </Col>
                  </Row>
                </div>
              )
            })}
            <Button onClick={addProjectFields}>Add More</Button>
            
          </Form>
          <br></br>
          <Link to="/skills"  state={{ data: [] }} className="nextlink" onClick={checkFormFilled}>CONTINUE</Link>
        </div>
      </div>
    );
  }
  
  export default Experience;