import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component, useEffect, useState } from 'react';
import { query, getDocs, collection, orderBy, timestamp } from "firebase/firestore"
import { db } from "../firebase/firebase"
import { UserAuth } from '../firebase/AuthContext';
import Accordion from 'react-bootstrap/Accordion';
import { useLocation } from "react-router-dom";

function Versions({coverID, coverTitle}) {
  const [pastVersions, setPastVersions] = useState([]);
  const { user, isLoading } = UserAuth();
  const [isWaitingDatabaseResponse, setIsWaitingDatabaseResponse] = useState(true);

  useEffect(() => {
    async function fetchPastVersions() {
      if (isLoading) {
        return;
      }

      const items = [];
      const coversRef = collection(db, `users/${user.uid}/covers/${coverID}/versions`);
      const q = query(coversRef, orderBy("timestamp"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        items.push(
          {timestamp: new Date(doc.data().timestamp).toLocaleString('en-US', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
          ,content: doc.data().content.replace(/\\n/g, "\n").replace(/"/g, "")}
        )
      })
      

      /* const groupedObjects = items.reduce((acc, obj) => {
        const index = acc.findIndex(item => item.title === obj.title);
        if (index === -1) {
          acc.push({ title: obj.title, content: [obj.content] });
        } else {
          acc[index].content.push(obj.content);
        }
        return acc;
      }, []); */

      setPastVersions(items);
      setIsWaitingDatabaseResponse(false);
      
      
    }
    
    fetchPastVersions();
    
  }, []);

    return (
      <div>
        <script>setPastVersions(fetchPastVersions()) console.log(pastVersions)</script>
        {
          isWaitingDatabaseResponse ? (
            <div className='loader-container'>
              <span className='spinner-text'>Loading</span>
              <div className="spinner"></div>
            </div>
    ) : pastVersions.length === 0 ? (
      <p>There are no past versions.</p>
          ) : (
            <div>
              <h1 className='h1'>{coverTitle}</h1>
              <Accordion>
              {pastVersions.map((pastVersions, index) => {
                return (
                  <Accordion.Item eventKey={index}>
                    <Accordion.Header>{pastVersions.timestamp}</Accordion.Header>
                    <Accordion.Body className="past-versions">
                      <pre className='cover-letter'>{pastVersions.content}</pre>
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
  
  export default Versions;
