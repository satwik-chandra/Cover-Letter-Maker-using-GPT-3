import React, { useState, useEffect } from 'react';
import { UserAuth } from '../firebase/AuthContext';
import { collection, addDoc, setDoc, doc, query, getDocs, updateDoc, deleteField } from 'firebase/firestore';
import { db } from '../firebase/firebase';

function UserProfile(props) {
  const { user, isLoading } = UserAuth();
  const [isWaitingDatabaseResponse, setIsWaitingDatabaseResponse] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [web, setWeb] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  async function setNameValue(value){
    setName(value)
    console.log('new value', value)
    const collectionRef = doc(db, `users/${user.uid}/personaldata`, 'personal');
    await setDoc(collectionRef, {
      name: value,
      phone: phone,
      email: email
    });
  }
  async function setPhoneValue(value){
    setPhone(value)
    console.log('new value', value)
    const collectionRef = doc(db, `users/${user.uid}/personaldata`, 'personal');
    await setDoc(collectionRef, {
      name: name,
      phone: value,
      email: email
    });
  }
  async function setEmailValue(value){
    setEmail(value)
    console.log('new value', value)
    const collectionRef = doc(db, `users/${user.uid}/personaldata`, 'personal');
    await setDoc(collectionRef, {
      name: name,
      phone: phone,
      email: value
    });
  }

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   setUserData({ ...userData, [name]: value });
  //   updateUserData({ [name]: value }); // call updateUserData to save changes to database
  // };
  
  // const updateUserData = async (data) => {
  //   if (data.name || data.email || data.phone) {
  //     const userRef = doc(db, `users/${user.uid}/personaldata/personal`);
  //     await setDoc(userRef, {
  //       name: data.name || userData.name,
  //       email: data.email || userData.email,
  //       phone: data.phone || userData.phone
  //     });
  //   // } else if (data.universities || data.majors) {
  //   //   const userRef = doc(db, `users/${user.uid}/personaldata/education`);
  //   //   await setDoc(userRef, {
  //   //     universities: data.universities || userData.universities,
  //   //     majors: data.majors || userData.majors
  //   //   });
  //   // } else if (data.skills) {
  //   //   const userRef = doc(db, `users/${user.uid}/personaldata/skills`);
  //   //   await setDoc(userRef, {
  //   //     skills: data.skills || userData.skills
  //   //   });
  //   }
  // };

  useEffect(() => {
    async function fetchData() {
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
            setName(doc.data()['name']);
          }
          if(doc.data()['phone']){
            setPhone(doc.data()['phone']);
          }
          if(doc.data()['email']){
            setEmail(doc.data()['email']);
          }
        }
        console.log(doc.id, " => ", doc.data());
      });
      setIsWaitingDatabaseResponse(false);
    }
    fetchData();
    
  }, [isLoading]);

  return (
    <div className="UserProfile">
      <div className={web?"cover-photo-container":"cover-photo-container mb"}>
      </div>

      <div className="avatar-container">
        <h1>{`${name}`}</h1>
        {
          isWaitingDatabaseResponse ? (
            <div className={web?'loader-container':"loader-container mob"}>
              <span className='spinner-text'>Loading</span>
              <div className="spinner"></div>
            </div>
          ) : isEditing ? (
            <form className="mx-auto col-md-6">
              <div className="form-group">
                <label>Names:</label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={e => setNameValue(e.target.value)}
                  className="form-control" // add form-control class
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="text"
                  name="email"
                  value={email}
                  onChange={e => setEmailValue(e.target.value)}
                  className="form-control" // add form-control class
                />
              </div>
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="text"
                  name="phone"
                  value={phone}
                  onChange={e => setPhoneValue(e.target.value)}
                  className="form-control" // add form-control class
                />
              </div>
              {/* <div className="form-group">
                <label>Universities:</label>
                <input
                  type="text"
                  name="universities"
                  value={userData.universities}
                  onChange={handleInputChange}
                  className="form-control" // add form-control class
                />
              </div>
              <div className="form-group">
                <label>Majors:</label>
                <input
                  type="text"
                  name="majors"
                  value={userData.majors}
                  onChange={handleInputChange}
                  className="form-control" // add form-control class
                />
              </div>
              <div className="form-group">
                <label>Skills:</label>
                <input
                  type="text"
                  name="skills"
                  value={userData.skills}
                  onChange={handleInputChange}
                  className="form-control" // add form-control class
                />
              </div> */}
            </form>
        ) : (
          <>
            <p>Email: {email}</p>
            <p>Phone: {phone}</p>
            {/* <p>Universities: {userData.universities}</p>
            <p>Majors: {userData.majors}</p>
            <p>Skills: {userData.skills}</p> */}
          </>
        )}
        <button onClick={handleEditClick} className="nextlink">
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>
    </div>
  );
}

export default UserProfile;
