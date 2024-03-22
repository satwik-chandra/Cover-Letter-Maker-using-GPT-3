import { UserAuth } from "../firebase/AuthContext";
import React, { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Home() {
  const [web, setWeb] = useState(false);
  const { user, logOutUser } = UserAuth();
  useEffect(()=>{
    if(navigator.userAgent.includes('Mac')&&!navigator.userAgent.includes('iPhone')||navigator.userAgent.includes('Windows')){
      setWeb(true)
    }
    },[])
  return (
    <div className={web?"home-container":"home-container-mb"}>
      <div className="text-center my-5">
        <h1 className="home-title">Write Your Next Chapter</h1>
        <p className="lead home-subtitle">A cutting-edge platform powered by OpenAI's GPT-3 language model to craft professional and impactful cover letters for job applications.</p>
        <Link to="/newcover" className="home-button">Create a New Cover Letter</Link>
      </div>
    </div>
  );
}

export default Home;
