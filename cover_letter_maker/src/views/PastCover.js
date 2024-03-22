import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component, useEffect, useState } from 'react';
import { query, getDocs, collection, orderBy, addDoc, updateDoc, doc } from "firebase/firestore"
import { db } from "../firebase/firebase"
import { UserAuth } from '../firebase/AuthContext';
import Accordion from 'react-bootstrap/Accordion';
import AutoResizeTextArea from '../components/AutoResizeTextArea';
import PastVersions from './PastVersions';
import { Link } from 'react-router-dom';
import { saveNewCoverVersion, deleteCoverLetter } from '../firebase/Queries';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

function PastCover() {
  const [coverLetters, setCoverLetters] = useState([]);
  const { user, isLoading } = UserAuth();
  const [isWaitingDatabaseResponse, setIsWaitingDatabaseResponse] = useState(true);
  const [indexLetterToEdit, setIndexLetterToEdit] = useState(-1);
  const [web, setWeb] = useState(false);
  var contentLetterToEdit = "";
  const [accordionActiveKey, setAccordionActiveKey] = useState("");
  console.log(accordionActiveKey);

  useEffect(() => {

    async function fetchPastCoverLetters() {
      if (isLoading) {
        return;
      }

      const covers = [];
      const coversRef = collection(db, `users/${user.uid}/covers`);
      const q = query(coversRef, orderBy("last_update", "desc"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        covers.push(
          {id: doc.id, title: doc.data().title, content: doc.data().content}
        )
      })
      console.log(covers);

      setCoverLetters(covers);
      setIsWaitingDatabaseResponse(false);
    }

    fetchPastCoverLetters();
    
  }, [isLoading]);
  
  function Versions(cl) {
    /*
    if (cl.content.length > 1) {
      return (
        <Accordion>
          {cl.content.map((versionLetter, index2) => {
            return (
              <Accordion.Item eventKey={index2}>
                <Accordion.Header>Version {index2+1}</Accordion.Header>
                <Accordion.Body className="cover-letter">
                  {versionLetter.split('\\n').map(str => <p>{str}</p>)}
                  <Button>View More</Button>
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
        </Accordion>
      );
    }
    */
  
    return (
      <div>
        {
          indexLetterToEdit == cl.index ? (
            <div>
              <AutoResizeTextArea content={cl.content} saveContent={handleSave}></AutoResizeTextArea>
              <div>
                <button className='pastcovers-button cancel' onClick={() => setIndexLetterToEdit(-1)}>Cancel</button>
                <button className='pastcovers-button save' onClick={saveEditedLetter}>Save</button>
              </div>
            </div>
          ) : (
            <div>
              <p>{cl.content.split('\\n').map(str => <p>{str}</p>)}</p>
              <Container>
                <Row className="justify-content-center">
                  <Col xs="auto">
                  <div>
                  <button  className='pastcovers-button edit' onClick={() => {setIndexLetterToEdit(cl.index);}}>Edit</button>
                </div>
                  </Col>
                  <Col xs="auto">
                  <div >
                  <button className='pastcovers-button delete' onClick={() => {deleteSpecificCover(cl.index);}}>Delete</button>
                </div>
                  </Col>
                </Row>
              </Container>
              
              <Link to="/pastversions" state={{ data: {coverID: coverLetters[cl.index].id, coverTitle: coverLetters[cl.index].title }}} className="nextlink">PAST VERSIONS</Link>
            </div>
          )
        }
      </div>
    );
  }

  /**
   * Delete a specific cover letter in firebase and in the current coverLetters array.
   * @param {int} indexCoverToDelete 
   */
  const deleteSpecificCover = (indexCoverToDelete) => {
    // Display a warning popup
    if (!window.confirm("Are you sur to delete the cover letter : " + coverLetters[indexCoverToDelete].title)) {
      return;
    }

    // delete the cover letter in firebase
    const coverIdToDelete = coverLetters[indexCoverToDelete].id;
    deleteCoverLetter(user.uid, coverIdToDelete);

    // remove the deleted cover from the list of cover letters
    const newCoverLettersArray = [];
    for (let i = 0; i < coverLetters.length; i++) {
      if (i != indexCoverToDelete)
        newCoverLettersArray.push(coverLetters[i]);
    }
    // update render
    setCoverLetters(newCoverLettersArray);
    setAccordionActiveKey("");
  }

  const handleSave = (event) => {
    contentLetterToEdit = event;
  }

  const saveEditedLetter = async () => {
    // save data in temp variables to avoid bugs
    const myIndexLetter = indexLetterToEdit;
    const myContent = contentLetterToEdit;

    saveNewCoverVersion(user.uid, coverLetters[myIndexLetter].id, myContent)

    // modify data in local array
    coverLetters[myIndexLetter].content = myContent;

    // reset display mode
    setIndexLetterToEdit(-1);
  }  
  useEffect(()=>{
    if(navigator.userAgent.includes('Mac')&&!navigator.userAgent.includes('iPhone')||navigator.userAgent.includes('Windows')){
      setWeb(true)
    }
    },[])

    return (
      <div className="past-cover">
        {
          isWaitingDatabaseResponse ? (
            <div className={web?'loader-container':"loader-container mob"}>
              <span className='spinner-text'>Loading</span>
              <div className="spinner"></div>
            </div>
          ) : (
            <div>
              <h1>Past Cover Letters</h1>
              <Accordion activeKey={accordionActiveKey}>
              {coverLetters.map((coverLetter, index) => {
                return (
                  <Accordion.Item eventKey={index}>
                    <Accordion.Header onClick={() => {(accordionActiveKey !== index) ? setAccordionActiveKey(index) : setAccordionActiveKey(""); setIndexLetterToEdit(-1);}}>{coverLetter.title}</Accordion.Header>
                    <Accordion.Body className="cover-letter">
                    <Versions content={coverLetter.content} index={index} />
                    </Accordion.Body>
                  </Accordion.Item>
                );
              })}
              </Accordion>
            </div>
          )
        }
      </div>
    );
  }
  
  export default PastCover;