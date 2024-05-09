import {
  DocumentData,
  Query,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { subStrFunc } from "../../helper/subStrFunc";
import { IoSearch } from "react-icons/io5";

const RecipesList = () => {
  const [recipeData, setRecipeData] = useState<any>([]);
  const [pagination, setPagination] = useState<any>([]);
  const [itemOfShow, setItemOfShow] = useState<{ start: number; end: number }>({
    start: 0,
    end: 8,
  });
  const [isLoading, setIsLoading] = useState(false);
  const categoriesList = [
    {
      slug: "",
      display: "All",
    },
    {
      slug: "dinner",
      display: "Dinner",
    },
    {
      slug: "breakfast",
      display: "Breakfast",
    },
    {
      slug: "pasta",
      display: "Pasta",
    },
    {
      slug: "vegetarian",
      display: "Vegetariant",
    },
    {
      slug: "desserts",
      display: "Desserts",
    },
    {
      slug: "seafood",
      display: "Seafood",
    },
  ];

  let location = useLocation();
  let navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const categories = searchParams.get("categories");
  // console.log(id);

  function handleCategories(event: any) {
    // alert(event.target.value);
    navigate(`/recipes-list?categories=${event.target.value}`);
  }

  //   Set pagination
  var paginationLength = () => {
    var recipeDataLength = recipeData.length;
    var indexOfShow = 8;
    if (recipeDataLength % indexOfShow === 0) {
      return Math.floor(recipeDataLength / indexOfShow);
    } else {
      return Math.floor(recipeDataLength / indexOfShow) + 1;
    }
  };

  function getPaginationItem() {
    var temp = [];
    for (var i = 1; i <= paginationLength(); i++) {
      temp.push(i);
    }
    setPagination(temp);
  }

  useEffect(() => {
    getPaginationItem();
  }, [recipeData]);
  //   Set pagination

  async function getRecipeData(categories?: string) {
    setIsLoading(true);
    setItemOfShow({ start: 0, end: 8 });
    const recipeRef = collection(db, "recipes");
    var recipeData: any[] = [];
    if (categories) {
      recipeData = (await getDocs(
        query(recipeRef, where("categories", "==", categories))
      )) as any;
    } else {
      recipeData = (await getDocs(recipeRef)) as any;
    }
    setRecipeData("");

    recipeData.forEach((doc: any) => {
      setRecipeData((prev: any) => [...prev, { id: doc.id, data: doc.data() }]);
    });
    setIsLoading(false);
  }

  useEffect(() => {
    getRecipeData(categories as string);
  }, [categories]);

  return (
    <section className="flex justify-center items-center">
      {isLoading ? (
        <span className="loading loading-spinner loading-lg h-[calc(100vh-80px)]" />
      ) : (
        <div className="container p-2 flex flex-col gap-10 justify-center items-center m-16 ">
          <h1 className="text-4xl font-bold w-full">
            Find Your Happinest{" "}
            {categories ? (
              <span className="font-light capitalize">: {categories}</span>
            ) : (
              ""
            )}
          </h1>
          <div className="flex justify-between w-full">
            <select
              className="select w-full max-w-xs rounded-3xl min-w-56 bg-[#05FF00] text-white transition"
              onChange={handleCategories}
            >
              {categoriesList.map((items, i) => (
                <option
                  value={items.slug}
                  key={i}
                  selected={items.slug == categories ? true : false}
                >
                  {items.display}
                </option>
              ))}
            </select>
            <div className="flex">
              <input type="text" className="px-4 py-2 rounded-s-3xl input input-bordered w-full max-w-xs rounded-e-none" />
              <button className="btn rounded-s-none rounded-e-3xl px-4 py-2 bg-[#05FF00] font-bold text-white text-center">
                <IoSearch className="text-xl"/>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-12">
            {recipeData
              ? recipeData.map((item: any, i: number) => {
                  if (i >= itemOfShow.start && i <= itemOfShow.end - 1) {
                    return (
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
                    );
                  }
                })
              : ""}
          </div>
          <div className="join w-full flex justify-center mt-14">
            {pagination.map((item: any, i: number) => (
              <button
                className={`join-item btn ${
                  itemOfShow.end / 8 == item ? "bg-slate-500 text-white" : ""
                }`}
                key={i}
                onClick={() =>
                  setItemOfShow({ start: item * 8 - 8, end: item * 8 })
                }
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default RecipesList;
