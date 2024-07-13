import './Cage.scss'
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { values } from 'lodash';
const CageAdmin = () =>{
  
  const [cageType,setCageType] = useState('');
  const handleInputChange = (event) =>{
    setCageType(event.target.value);
  }
  const handleSubmit = async  (event) =>{
    event.preventDefault(); 
    try{
      const res = await axios.post("http://localhost:8080/cage/create",
        {
          type :cageType
        }
      );
      toast.success("Add cage success")
    }catch(err){
      toast.error('Failed to add cage')
    }
  }
  return(
    <>
    <h1>Add Cage</h1>
      <form onSubmit={handleSubmit} className='formContainer'>
       <lable>
        Cage Type:
        <input type='text' value={cageType} onChange={handleInputChange} />
       </lable>
       <button type="submit">Add Cage</button>
      </form>
    </>
  )
}
export default CageAdmin