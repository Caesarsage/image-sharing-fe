import React, { useEffect, useState } from 'react'
import { RWebShare } from "react-web-share";

import Progress from '../components/Progress'
import Message from '../components/Message'
import ImageFinder from '../api/index'
import { Loading } from '../components/Loading';
import jwtDecode from 'jwt-decode';
import { Navigate} from 'react-router-dom';

const Home = () => {
  const [selectedfile, setSelectedFile] = useState('')
  const [uploadFile, setUploadFile] = useState({})
  const [id, setFileId] = useState('') 
  const [password, setPassword] = useState('') 
  const [filename, setFilename] = useState('Choose image...')
  const [uploadPercentage, setUploadPercentage] = useState(0)
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('uploadProfile'))

  useEffect(()=>{
    // jwtDecode
    const token = user?.token

    if (token) {
      const decode =  jwtDecode(token);

      if(decode.exp * 1000 < new Date().getTime()){
        localStorage.clear()
        return <Navigate to={`/share/${id}/auth`} replace />
        
      }
    }
  },[id, user?.token])


  const onSubmit = async (e)=>{
    e.preventDefault()
    const formData = new FormData();
    
    formData.append('image', selectedfile)
    formData.append('password', password)
    setLoading(true)
    try {
      const result = await ImageFinder.post('/', formData, {
        Headers :{
          'Content-Type':'multipart/form-data'
        },
        onUploadProgress : progressEvent =>{
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          )
        }
      });
      localStorage.setItem('uploadProfile', JSON.stringify({...result?.data}))

      const { fileName, filePath, id} = result.data.data
      setUploadFile({ fileName, filePath})
      setFileId(id)
      setLoading(false)
      // clear percentage
      setTimeout(() => setUploadFile(0), 10000)
      setMessage({msg:'Uploaded successfully', type:'success'})
    } catch (error) {
      setLoading(false)
      setMessage({msg: 'Encounter an Error', type: 'error'})
      setUploadPercentage(0)
    }
  }

  const onChange = async (e) =>{
    if (!e.target.files[0].name.match(/.(jpg|jpeg|png|svg)$/i)){
      alert('Not a supported image format');
      setMessage({type:"error", msg:"Not a supported image format"})
      setFilename("Choose image...")
      setSelectedFile('')
    }else{
      setSelectedFile(e.target.files[0]);
      setFilename(e.target.files[0].name);
    }
  }

  return (
    <div className='container mt-4'>
      {loading && <Loading/> } 
      {message ? <Message msg={message.msg} type={message.type} /> : null}
      <form onSubmit={onSubmit}>

        <div className='form-file custom-file mb-4'>
          <input
            type='file'
            className='form-file-input custom-file-input'
            id='customFile'
            onChange={onChange}
            required
          />
          <label className='custom-file-label' htmlFor='customFile'>
            {filename}
          </label>
        </div>
        <div className='mb-4'>
          <label className='form-label' htmlFor='pwd'>
            Password             
          </label><br></br>
          <input
            type='password'
            className='form-input form-control'
            id='pwd'
            placeholder='Protect your image'
            onChange={(e)=> setPassword(e.target.value)}
            required
          />
          
        </div>
        <Progress percentage={uploadPercentage} />
        <input
          type='submit'
          value='Upload'
          className='btn btn-primary btn-block mt-4'
        />
      </form>

      {id ? (
        <div className='row mt-5'>
          <div className='col-md-6 m-auto'>
            <h3 className='text-center'>{uploadFile.fileName}</h3>
            <h5>Your file protected link</h5>
            <i>https://secure-img-share.netlify.app/share/${id}/auth </i>


            <RWebShare
              data={{
                text: `protected image, enter password to open ...`,
                url: `/share/${id}/auth`,
                title: `https://secure-img-share.netlify.app/share/${id}/auth`,
              }}
              onClick={() => console.log("shared successfully!")}
            >
              <button className='btn btn-success'>Share ????</button>
            </RWebShare> 
          </div>
          <div>
           
          </div>
        </div>
      ) : null}

    </div>
  )
}

export default Home