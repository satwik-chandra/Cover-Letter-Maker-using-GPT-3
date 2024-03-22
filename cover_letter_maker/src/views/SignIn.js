import 'bootstrap/dist/css/bootstrap.min.css';
import './SignIn.css';
import React, { Component } from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../firebase/AuthContext"
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const {signInUser} = UserAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await signInUser(email, password);
            navigate("/");
        } catch (err) {
            setError(err.message);
            console.log(err.message);
        }
    }

    return (
        <div className="Signin">
            <h2>Sign in</h2>
            <div className='Form'>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    {error != "" && <p className="bad-login-message">Bad email address or password...</p>}
                    <div className='centerrow'>
                        <Row className="text-center">
                            <Col>
                                <Button variant="primary" type="submit">
                                    Log In
                                </Button>
                                

                                
                            </Col>
                        </Row>
                    </div>
                    
                </Form>
            </div>
            

            
        </div>
    );
}

export default SignIn;