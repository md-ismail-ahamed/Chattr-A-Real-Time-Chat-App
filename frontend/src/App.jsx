import React from 'react'
import Navbar from "./components/Navbar";
import { Routes,Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import {axiosInstance} from './lib/axios'
import { useState } from 'react';
import { useEffect } from 'react';
import {useAuthStore} from './store/useAuthStore';
import {useThemeStore} from './store/useThemeStore';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';




export const App = () => {
  const {authUser,checkAuth,isCheckingAuth} = useAuthStore();
  const {theme} = useThemeStore();
  const { onlineUsers } = useAuthStore();
  console.log(onlineUsers);
  
  useEffect(()=>{
    checkAuth();
  },[]);
  console.log({authUser});
  if(isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin"/>
      </div>
  );
  return (
    <div data-theme={theme}>
     <Navbar />
     <Routes>
        <Route path="/" element={authUser ? <HomePage />: <Navigate to="/signin" />}/>
      <Route path="/signup" element={!authUser ?<SignUpPage />: <Navigate to="/" />}/>
      <Route path="/signin" element={!authUser ? <SignInPage />: <Navigate to="/" />}/>
      <Route path="/settings" element={<SettingsPage />}/>
      <Route path="/profile" element={authUser ? <ProfilePage />: <Navigate to="/signin" />}/>
     </Routes>
     <Toaster/>
    </div>
  );
};

export default App;