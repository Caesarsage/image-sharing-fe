import "./index.css";
import { BrowserRouter , Navigate, Route, Routes, useParams } from "react-router-dom";
import Home from "./pages/Home";
import {Error} from "./pages/Error";
import { Index } from "./pages/unlock";
import { View } from "./pages/View";
import { Navbar } from "./pages/Navbar";
import { HowTo } from "./pages/HowTo";
import { Footer } from "./pages/Footer";
import jwtDecode from 'jwt-decode';
import { useEffect } from "react";


const MyRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/share/${id}/auth`} replace />;
};

function App() {
  const user = JSON.parse(localStorage.getItem('uploadProfile'))

  useEffect(()=>{
    // jwtDecode
    const token = user?.token

    if (token) {
      const decode =  jwtDecode(token);

      if(decode.exp * 1000 < new Date().getTime()){
        localStorage.clear()
        return <MyRedirect />
        
      }
    }
  },[])

  return (
    <div className="d-flex flex-column min-vh-100">
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how" element={<HowTo />} />
            <Route path="/share/:id" element={ user ? <View/> : <MyRedirect />} /> 
            <Route path="/share/:id/auth" element={<Index />} />     
            <Route path="*" element={<Error />} />
          </Routes>
          <Footer />
        </BrowserRouter>
    </div>
  );
}

export default App;
