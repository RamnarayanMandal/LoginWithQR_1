import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import axios from 'axios';

const Login = () => {
  const { panshopOwner_id } = useParams();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/panShopLogin/${panshopOwner_id}`);
        setLoginData(response.data);
        console.log(response.data) 
        localStorage.setItem("id", response.data.owner._id);
        localStorage.setItem("panShopOwner", response.data.owner.panShopOwner);
        localStorage.setItem("address", response.data.owner.address);
        localStorage.setItem("state", response.data.owner.state);
        
        navigate("/admin");

      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [panshopOwner_id]);

  // Redirect if loginData is not null
  
  return (
    <>
      {loginData ? (
        <h1 className='text-white'>Login successful</h1>
      ) : (
        <div className='flex justify-center items-center content-center'>
          <h1 className='text-white font-semibold text-3xl pt-20'>Login failed, please try again</h1>
        </div>
      )}
    </>
  );
}

export default Login;