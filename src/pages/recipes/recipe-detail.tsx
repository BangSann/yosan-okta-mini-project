import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import alt from "../../assets/profile-image.png";
import { MdFavoriteBorder } from "react-icons/md";
import { MdFavorite } from "react-icons/md";
import { splitString } from "../../helper/spliterStringFunc";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const RecipeDetail = ({ isLogin }: { isLogin: boolean }) => {
  const [detailedRecipe, setDetailedRecipe] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [favoritedId, setFavoritedId] = useState("");
  let params = useParams();
  let recipe_id = params.recipeId as string;

  // dummy
  const user = useSelector((state: any) => state.user.user);

  async function getFavoritedId() {
    const datas = await getDocs(
      query(
        collection(db, "favorited_recipe"),
        where("user_id", "==", user.id),
        where("recipe_id", "==", recipe_id)
      )
    );

    datas.forEach((doc: any) => {
      setFavoritedId(doc.id);
    });
  }

  useEffect(() => {
    getFavoritedId();
  }, []);

  console.log(favoritedId);

  async function handleAddToFavorite() {
    if (!isLogin) {
      Swal.fire({
        icon : "warning",
        text : "You must login first !!"
      })
    } else {
      await addDoc(collection(db, "favorited_recipe"), {
        user_id: user.id,
        recipe_id: recipe_id,
      }).then(() => {
        Swal.fire({
          icon: "success",
          text: "Successfuly add to favorite ",
        });
      });

      getFavoritedId();
    }
  }
  async function handleUnFavorite() {
    await deleteDoc(doc(db, "favorited_recipe", favoritedId)).then(() => {
      setFavoritedId("");
      Swal.fire({
        icon: "warning",
        text: "Deleted from favorite",
      });
    });
  }
  // dummy

  async function getRecipeDetail() {
    setIsLoading(true);
    let dataRecipe = await getDoc(doc(db, "recipes", recipe_id));
    setDetailedRecipe(dataRecipe.data());
    setIsLoading(false);
  }

  useEffect(() => {
    getRecipeDetail();
  }, []);
  return (
    <section className="w-full flex justify-center items-center">
      {isLoading ? (
        <span className="loading loading-spinner loading-lg h-[calc(100vh-80px)]" />
      ) : (
        <div className="container p-2 grid grid-cols-3 gap-10 my-16">
          <div className="col-span-1 rounded-lg relative">
            <img
              src={detailedRecipe.thumbnail_url || alt}
              className="rounded-lg object-cover w-full"
            />
          </div>
          <div className="col-span-2 flex flex-col gap-5">
            <div className="flex justify-between items-start">
              <h1 className="text-4xl font-semibold">{detailedRecipe.name}</h1>
              {favoritedId ? (
                <button
                  className="btn bg-transparent border-none hover:bg-transparent"
                  onClick={handleUnFavorite}
                >
                  <MdFavorite className="text-4xl text-red-500 cursor-pointer" />
                </button>
              ) : (
                <button
                  className="btn bg-transparent border-none hover:bg-transparent"
                  onClick={handleAddToFavorite}
                >
                  <MdFavoriteBorder className=" text-4xl text-red-500 cursor-pointer" />
                </button>
              )}
            </div>
            {detailedRecipe.description ? (
              <p
                className="text-base font-light"
                dangerouslySetInnerHTML={{ __html: detailedRecipe.description }}
              ></p>
            ) : (
              ""
            )}
            <h1 className="text-2xl font-semibold">Ingredients : </h1>
            <ul className="list-disc list-inside">
              {detailedRecipe.ingredients
                ? splitString(detailedRecipe?.ingredients, ",").map(
                    (items, i) => {
                      if (items !== "") {
                        return <li key={i}>{items}</li>;
                      }
                    }
                  )
                : ""}
            </ul>
            <h1 className="text-2xl font-semibold">Instruction : </h1>
            <ul className="list-decimal list-inside">
              {detailedRecipe.instructions
                ? splitString(detailedRecipe?.instructions, ".,").map(
                    (items, i) => {
                      if (items.toLocaleLowerCase().includes("enjoy")) {
                        return (
                          <h1 key={i} className="text-2xl font-semibold mt-5">
                            {items}
                          </h1>
                        );
                      }
                      if (items !== "") {
                        return <li key={i}>{items}</li>;
                      }
                    }
                  )
                : ""}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};

export default RecipeDetail;
