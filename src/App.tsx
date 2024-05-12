import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import GeneratorRecipe from "./pages/GeneratorRecipe";
import Home from "./pages/home";
import Login from "./pages/register/login";
import { useState } from "react";
import SignUp from "./pages/register/signUp";
import Navbar from "./componets/navbar";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Profile from "./pages/profile";
import { useDispatch } from "react-redux";
import { setUser } from "./slice/user.slice";
import RecipesList from "./pages/recipes";
import RecipeDetail from "./pages/recipes/recipe-detail";
import EditProfile from "./pages/profile/EditProfile";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const userRef = collection(db, "users");
  const dispatch = useDispatch();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      getUser(user.uid);
      setIsLogin(true);
    } else {
      setIsLogin(false);
      dispatch(setUser(""));
    }
  });
  async function getUser(authID: string) {
    const dataUsers = (await getDocs(
      query(userRef, where("id", "==", authID))
    )) as any;

    dataUsers.forEach((doc: any) => {
      dispatch(setUser(doc.data()));
    });
  }

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
              <Navbar isLogin={isLogin} />
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
                  <Navbar isLogin={isLogin} />
                  <GeneratorRecipe />
                </>
              }
            />
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute
              element={
                <>
                  <Navbar isLogin={isLogin} />
                  <Profile />
                </>
              }
            />
          }
        />
        <Route
          path="/profile/edit"
          element={
            <PrivateRoute
              element={
                <>
                  <EditProfile />
                </>
              }
            />
          }
        />
        <Route
          path="/recipes-list"
          element={
            <>
              <Navbar isLogin={isLogin} />
              <RecipesList />
            </>
          }
        />
        <Route
          path="/recipes-list/:recipeId"
          element={
            <>
              <Navbar isLogin={isLogin} />
              <RecipeDetail isLogin={isLogin}/>
            </>
          }
        />
        <Route
          path="/login"
          element={isLogin ? <Navigate to={"/"} /> : <Login />}
        />
        <Route
          path="/sign-up"
          element={isLogin ? <Navigate to={"/"} /> : <SignUp />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
