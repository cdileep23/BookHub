import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar"
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";


import { BASE_URL } from "@/utils/url";
import { userLoggedIn } from "@/store/user";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((store) => store.user);
  const isAuthRoute = location.pathname.includes("/auth");

  const fetchUser = async () => {
    if (user) return;
    try {
      const response = await axios.get(`${BASE_URL}/user/profile`, {
        withCredentials: true,
      });
      console.log(response);
      dispatch(userLoggedIn(response.data.user));
      
     
      if (isAuthRoute) {
        navigate("/");
      }
    } catch (error) {
      if (error.response?.status === 401 && !isAuthRoute) {
        navigate("/auth");
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  console.log("Body")
  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthRoute && <Navbar />}
      <main className={isAuthRoute ? "" : "pt-16 flex-grow"}>
        <div className="container mx-auto px-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Body;