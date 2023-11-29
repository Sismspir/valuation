import { Navigate, useNavigate, Outlet } from 'react-router-dom';
import React, { useEffect, useContext, useState } from 'react';
import Register from '../UserManagment/Register';

const ProtectedRoutes = (props: {loggedIn:boolean}) => {
  const navigate = useNavigate();
  
  // Debug Message
  console.log(`[Protected] isLoggedIN: ${props.loggedIn}`);
  return props.loggedIn ? <Outlet /> : <Register/>;
};

export default ProtectedRoutes;
