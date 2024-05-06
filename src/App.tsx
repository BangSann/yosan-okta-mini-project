import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import GeneratorRecipe from "./pages/GeneratorRecipe";
import Home from "./pages/home";
import Login from "./pages/register/login";
import { useState } from "react";
import SignUp from "./pages/register/signUp";
import Navbar from "./componets/navbar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

function App() {
  const [isLogin, setIsLogin] = useState(false);

  onAuthStateChanged(auth ,(user)=>{
    if (user) {
      setIsLogin(true)
    }else{
      setIsLogin(false)
    }
  })

  function PrivateRoute({ element }: { element: any }) {
    if (!isLogin) {
      return <Navigate to={"/login"} />;
    } else {
      return element;
    }
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />
        <Route
          path="/generator-recipe"
          element={
            <PrivateRoute
              element={
                <>
                  <Navbar />
                  <GeneratorRecipe />
                </>
              }
            />
          }
        />
        <Route path="/login" element={isLogin ? <Navigate to={"/"}/> : <Login/>} />
        <Route path="/sign-up" element={isLogin ? <Navigate to={"/"}/> : <SignUp/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
