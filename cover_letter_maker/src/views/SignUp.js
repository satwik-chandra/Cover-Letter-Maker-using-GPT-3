import 'bootstrap/dist/css/bootstrap.min.css';
import './SignIn.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../firebase/AuthContext"
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase"
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { createUser } = UserAuth();
    const navigate = useNavigate();

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await createUser(email, password).then(cred => {
                setDoc(doc(db, "users", cred.user.uid), {
                    userEmail: email
                });
                navigate("/profile-info");
            });
        } catch (err) {
            setError(err.message);
            console.log(err.message);
        }
    }

    return (
        <div className="Signup">
            <h2>Sign up</h2>
            <div className='Form'>
                <Form onSubmit={handleFormSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    {error != "" && <p className="bad-login-message">Error email already in use or password less than 6 characteres...</p>}
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default SignUp;
