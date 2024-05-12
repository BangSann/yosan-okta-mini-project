import { useSelector } from "react-redux";
import imgAlt from "../../assets/profile-image.png";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { subStrFunc } from "../../helper/subStrFunc";
import { MdOutlineAddBox } from "react-icons/md";
import { FaStar } from "react-icons/fa";

const Profile = () => {
  const userData = useSelector((state: any) => state.user.user);
  const [recipeList, setRecipeList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function getRecipeList(recipe_id: string) {
    const datas = await getDoc(doc(db, "recipes", recipe_id));

    setRecipeList((prev: any) => [
      ...prev,
      { id: datas?.id, data: datas?.data() },
    ]);
  }
  async function getFavoritedRecipe() {
    setIsLoading(true);
    const data = await getDocs(
      query(
        collection(db, "favorited_recipe"),
        where("user_id", "==", userData.id)
      )
    );

    setRecipeList("");
    data.forEach((doc: any) => {
     getRecipeList(doc.data().recipe_id);
    });
    setIsLoading(false);
  }

  useEffect(() => {
    getFavoritedRecipe();
  }, [userData]);
  return (
    <section className="w-full flex justify-center">
      <div className="container p-2 mt-12 min-h-[calc(100vh-80px)]">
        <div className="flex items-center gap-7">
          <img
            src={userData.profileImg || imgAlt}
            alt="profile-image"
            className="rounded-full w-[300px] h-[300px]"
          />
          <div className="flex flex-col gap-4 justify-center items-start py-3">
            <h1 className="text-5xl font-bold leading-none">
              {userData.fullName}
            </h1>
            <p className="underline text-lg px-2 cursor-pointer">
              {userData.email}
            </p>
            <Link to={"./edit"} className="px-2 underline text-blue-600">
              Edit Profile
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-10 my-16 h-auto">
          <div className="w-full flex justify-between items-center">
            <h1 className="text-4xl font-normal">Favorite Recipes</h1>
            <Link to={"/recipes-list"}>
              <MdOutlineAddBox className="text-3xl cursor-pointer" />
            </Link>
          </div>
          {isLoading ? (
            <div className="w-full flex justify-center items-center h-[30vh] bg-slate-100 rounded-2xl">
              <span className="loading loading-spinner loading-lg " />
            </div>
          ) : recipeList ? (
            <div className="grid grid-cols-4 gap-12">
              {recipeList.map((item: any, i: number) => (
                <Link
                  to={`/recipes-list/${item.id}`}
                  key={i}
                  className="flex flex-col gap-2 items-center justify-between hover:scale-105 rounded-lg transition "
                >
                  <div className="h-[280px] flex items-center bg-slate-400 rounded-lg hover:shadow-xl">
                    <img
                      src={item.data.thumbnail_url}
                      alt=""
                      className="rounded-lg object-cover w-full "
                    />
                  </div>
                  <p className="text-xl font-semibold text-center">
                    {item.data.name}
                  </p>
                  <div className="flex gap-5">
                    <p className="flex gap-1 justify-center items-center">
                      <FaStar className="text-yellow-400" />
                      {subStrFunc(item.data.user_ratings)}
                    </p>
                    <p>
                      <b>{item.data.num_servings}</b> Servings
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="w-full flex justify-center items-center h-[30vh] bg-slate-100 rounded-2xl">
              <Link to={"/recipes-list"}>
                <button className="p-4 text-[24px] font-semibold text-slate-300 border rounded-xl">
                  Add Favorite Recipe
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Profile;
