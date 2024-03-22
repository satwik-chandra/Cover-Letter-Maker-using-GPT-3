import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../firebase/AuthContext";
import { collection, addDoc, setDoc, doc, query, getDocs, updateDoc, deleteField } from 'firebase/firestore';
import { db } from "../firebase/firebase";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const ProfileInfo = () => {
    const { user } = UserAuth();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    // const [universities, setUniversities] = useState("");
    // const [majors, setMajors] = useState("");
    // const [skills, setSkills] = useState("");
    const [error, setError] = useState("");

    async function setNameValue(value) {
        setName(value)
        console.log('new value', value)
        const collectionRef = doc(db, `users/${user.uid}/personaldata`, 'personal');
        await setDoc(collectionRef, {
            name: value,
            email: email,
            phone: phone
        });
    }

    async function setEmailValue(value) {
        setEmail(value)
        console.log('new value', value)
        const collectionRef = doc(db, `users/${user.uid}/personaldata`, 'personal');
        await setDoc(collectionRef, {
            name: name,
            email: value,
            phone: phone
        });
    }

    async function setPhoneValue(value) {
        setPhone(value)
        console.log('new value', value)
        const collectionRef = doc(db, `users/${user.uid}/personaldata`, 'personal');
        await setDoc(collectionRef, {
            name: name,
            email: email,
            phone: value
        });
    }

    // async function setUniversitiesValue(value) {
    //     setUniversities(value)
    //     console.log('new value', value)
    //     const collectionRef = doc(db, `users/${user.uid}/personaldata`, 'education');
    //     await setDoc(collectionRef, {
    //         universities: value,
    //         majors: majors
    //     });
    // }

    // async function setMajorsValue(value) {
    //     setMajors(value)
    //     console.log('new value', value)
    //     const collectionRef = doc(db, `users/${user.uid}/personaldata`, 'education');
    //     await setDoc(collectionRef, {
    //         universities: universities,
    //         majors: value
    //     });
    // }

    // async function setSkillsValue(value) {
    //     setSkills(value)
    //     console.log('new value', value)
    //     const collectionRef = doc(db, `users/${user.uid}/personaldata`, 'skills');
    //     await setDoc(collectionRef, {
    //         skills: value
    //     });
    // }

    const checkFormFilled = (event) => {
        if (!name || !email || !phone) {
          event.preventDefault();
          alert("Please fill in all fields before navigating to another page.");
        } else {
            navigate("/");
        }
    };
    
    return (
        <div>
            <div className='page-title'>
                <h1>Profile Information</h1>
            </div>
            
            <div className="ProfileInfo">
                <div className='Form'>
                    <Form onSubmit={checkFormFilled}>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter name" onChange={(e) => setNameValue(e.target.value)} />
                        </Form.Group>
        
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text" placeholder="Enter email" onChange={(e) => setEmailValue(e.target.value)} />
                        </Form.Group>
        
                        <Form.Group className="mb-3" controlId="formPhone">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control type="text" placeholder="Enter phone" onChange={(e) => setPhoneValue(e.target.value)} />
                        </Form.Group>
        
                        {/* <Form.Group className="mb-3" controlId="formUniversities">
                            <Form.Label>Universities</Form.Label>
                            <Form.Control type="text" placeholder="Enter universities" onChange={(e) => setUniversitiesValue(e.target.value)} />
                        </Form.Group>
        
                        <Form.Group className="mb-3" controlId="formMajors">
                            <Form.Label>Majors</Form.Label>
                            <Form.Control type="text" placeholder="Enter majors" onChange={(e) => setMajorsValue(e.target.value)} />
                        </Form.Group>
        
                        <Form.Group className="mb-3" controlId="formSkills">
                            <Form.Label>Skills</Form.Label>
                            <Form.Control type="text" placeholder="Enter skills" onChange={(e) => setSkillsValue(e.target.value)} />
                        </Form.Group> */}
        
                        {error && <p className="error">{error}</p>}
        
                        <Button variant="primary" type="submit" className="submit-button">
                            Save
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default ProfileInfo;    