import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import AutoResizeTextArea from '../components/AutoResizeTextArea';
import { saveNewCoverVersion, saveNewCover } from '../firebase/Queries';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Regenerate from '../views/Regenerate';

function CoverDisplay({userId, coverId, letterTitle, letterContent}) {
  const [isEditing, setIsEditing] = useState(false);
  const [letter, setLetter] = useState(letterContent);
  const [userFeedback, setUserFeedback] = useState('');
  const [displayLoadingScreen, setDisplayLoadingScreen] = useState(false);
  const [web, setWeb] = useState(false);
  var contentEditedLetter = "";

  useEffect(() => {
      if(navigator.userAgent.includes('Mac')&&!navigator.userAgent.includes('iPhone')||navigator.userAgent.includes('Windows')){
        setWeb(true)
      }
    }, []);

  const handleSave = (newContent) => {
    contentEditedLetter = newContent;
  };

  const saveEditedLetter = async () => {    
    saveNewCoverVersion(userId, coverId, contentEditedLetter);
    setLetter(contentEditedLetter);
    setIsEditing(false);
  };

  const handleFeedbackChange = (event) => {
    setUserFeedback(event.target.value);
  };

  const regenerateCoverLetter = async () => {
    console.log("Starting regeneration...");

    //get the feedback from the user and store it in feedback
    //For testing: Use the local host url
    let  url = 'http://localhost:3001/regenerate?cover_letter=' + encodeURIComponent(letter) + '&feedback=' + encodeURIComponent(userFeedback);
    
    //For production: Use the heroku url
    //let url = 'https://coverlettermaker.herokuapp.com/regenerate?cover_letter=' + encodeURIComponent(letter) + '&feedback=' + encodeURIComponent(userFeedback);

    // Start loading screen
    setDisplayLoadingScreen(true);

    // call the back api for regenerate the cover letter
    const response = await axios.get(url, {});
    console.log(response.data);
    contentEditedLetter = response.data.replace(/\\n/g, "\n").replace(/"/g, "");
    saveEditedLetter();

    // Stop loading screen
    setDisplayLoadingScreen(false);
  }

  return (
    <div className='cover-display-container'>
      <h1>{letterTitle}</h1>
      {displayLoadingScreen ? (
        <div className='loader-container'>
          <span className='spinner-text'>Loading</span>
          <div className="spinner"></div>
        </div>
      ) : (
        <div>
          {isEditing ? (
              <div>
                  <AutoResizeTextArea
                      content={letter}
                      saveContent={handleSave}
                  />
                  <button className='pastcovers-button cancel' onClick={() => setIsEditing(false)}>Cancel</button>
                  <button className='pastcovers-button save' onClick={saveEditedLetter}>Save</button>

              </div>
          ) : (
              <div>
                  <pre className={web ? "cover-letter" : "cover-letter mob"}>{letter}</pre>
                  <button className='secondary-button' onClick={() => setIsEditing(true)}>Edit manually</button>
                  <div>
                  <Form>
                    <Form.Group className="mb-3" controlId="feedback">
                      <Form.Label>Enter feedback and regnerate your cover letter:</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={userFeedback}
                        onChange={handleFeedbackChange}
                      />
                    </Form.Group>
                  </Form>
                  <button className='secondary-button' onClick={regenerateCoverLetter} disabled={!userFeedback}>
                    Regenerate
                  </button>
                </div>
                
                

                <Link to="/"  className="donelink">Done</Link>
              </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CoverDisplay;
