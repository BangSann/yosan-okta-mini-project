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

const Profile = () => {
  const userData = useSelector((state: any) => state.user.user);
  const [recipeList, setRecipeList] = useState<any>([]);

  console.log(recipeList);

  async function getRecipeList(recipe_id: string) {
    setRecipeList([]);
    const datas = await getDoc(doc(db, "recipes", recipe_id));

    setRecipeList((prev: any) => [
      ...prev,
      { id: datas.id, data: datas.data() },
    ]);
  }
  async function getFavoritedRecipe() {
    const data = await getDocs(
      query(
        collection(db, "favorited_recipe"),
        where("user_id", "==", userData.id)
      )
    );

    data.forEach((doc: any) => {
      getRecipeList(doc.data().recipe_id);
    });
  }

  useEffect(() => {
    getFavoritedRecipe();
  }, []);
  return (
    <section className="w-full flex justify-center">
      <div className="container p-2 mt-10 h-[calc(100vh-80px)]">
        <div className="flex items-start gap-7">
          <img
            src={userData.profileImg || imgAlt}
            alt=""
            className="rounded-3xl w-[300px] h-[300px]"
          />
          <div className="flex flex-col gap-4 justify-start items-start py-3">
            <h1 className="text-5xl font-bold leading-none">
              {userData.fullName}
            </h1>
            <p className="underline text-lg px-2 cursor-pointer">
              {userData.email}
            </p>
          </div>
        </div>
        <div className="mt-7 flex flex-col gap-10">
          <div className="w-full flex justify-between items-center">
            <h1 className="text-4xl font-light px-5">Favorite Recipes</h1>
            <Link to={"/recipes-list"}>
              <MdOutlineAddBox className="text-3xl cursor-pointer" />
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-5 mb-40">
            {recipeList
              ? recipeList.map((item: any, i: number) => (
                  <Link
                    to={`/recipes-list/${item.id}`}
                    key={i}
                    className="flex flex-col gap-2 items-center justify-between hover:scale-105 rounded-lg transition "
                  >
                    <div className="h-[280px] flex items-center bg-slate-400 rounded-lg hover:shadow-xl">
                      <img
                        src={item.data.thumbnail_url}
                        alt=""
                        className="rounded-lg object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-xl font-semibold text-center">
                      {item.data.name}
                    </p>
                    <div className="flex gap-5">
                      <p>{subStrFunc(item.data.user_ratings)}</p>
                      <p>
                        <b>{item.data.num_servings}</b> Servings
                      </p>
                    </div>
                  </Link>
                ))
              : ""}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
