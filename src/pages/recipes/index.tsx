import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { subStrFunc } from "../../helper/subStrFunc";
import { IoSearch } from "react-icons/io5";
import { capitalizeString } from "../../helper/capitalizeString";
import { FaStar } from "react-icons/fa";

const RecipesList = () => {
  const [recipeData, setRecipeData] = useState<any>([]);

  const [recipeNameInput, setRecipeNameInput] = useState("");
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

  let location = useLocation();
  let navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const categories = searchParams.get("categories");
  const indexOfSearch = searchParams.get("indexOfSearch");

  function handleCategories(event: any) {
    navigate(`/recipes-list?categories=${event.target.value}`);
  }
  function handleFindByName() {
    navigate(`/recipes-list?indexOfSearch=${recipeNameInput}`);
  }

  async function getRecipeData() {
    setIsLoading(true);
    setItemOfShow({ start: 0, end: 8 });
    const recipeRef = collection(db, "recipes");
    var recipeData: any[] = [];
    if (categories) {
      recipeData = (await getDocs(
        query(recipeRef, where("categories", "==", categories))
      )) as any;
    } else if (indexOfSearch) {
      recipeData = (await getDocs(
        query(
          recipeRef,
          where("name", ">=", capitalizeString(indexOfSearch)),
          where("name", "<=", capitalizeString(indexOfSearch) + "\uf8ff")
        )
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
    getRecipeData();
  }, [categories || indexOfSearch]);

  return (
    <section className="flex justify-center items-center min-h-[calc(100vh-80px)]">
      {isLoading ? (
        <span className="loading loading-spinner loading-lg " />
      ) : (
        <div className="container p-2 flex flex-col gap-10 items-center md:my-16 my-4 min-h-[calc(100vh-80px)]">
          <h1 className="text-4xl font-bold w-full">
            Find Your Happinest{" "}
            {categories || indexOfSearch ? (
              <span className="font-light capitalize">
                : {categories || indexOfSearch}
              </span>
            ) : (
              ""
            )}
          </h1>
          <div className="grid md:grid-cols-12 grid-cols-1 w-full gap-2">
            <select
              className="select btn text-start w-full rounded-3xl bg-[#05FF00] text-white transition md:col-span-4"
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
            <div className="col-span-4 md:block hidden"></div>
            <div className="flex md:col-span-4">
              <input
                type="text"
                className="px-4 py-2 rounded-s-3xl input input-bordered w-full rounded-e-none"
                onChange={(event) => setRecipeNameInput(event.target.value)}
                placeholder="Type here"
              />
              <button
                className="btn rounded-s-none border-[#05FF00] rounded-e-3xl px-4 py-2 bg-[#05FF00] font-bold text-white text-center"
                onClick={handleFindByName}
              >
                <IoSearch className="text-xl" />
              </button>
            </div>
          </div>
          {recipeData ? (
            <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 lg:gap-x-6 xl:gap-12 gap-x-2 gap-y-6">
              {recipeData.map((item: any, i: number) => {
                if (i >= itemOfShow.start && i <= itemOfShow.end - 1) {
                  return (
                    <Link
                      to={`/recipes-list/${item.id}`}
                      key={i}
                      className="flex flex-col gap-2 items-center justify-between hover:scale-105 rounded-lg transition w-full"
                    >
                      <div className="flex items-center bg-slate-400 rounded-lg hover:shadow-xl min-h-[200px] sm:min-h-[245px] lg:min-h-[298px] xl:min-h-[362px]">
                        <img
                          src={item.data.thumbnail_url}
                          alt=""
                          className="rounded-lg object-cover w-full h-full"
                        />
                      </div>
                      <p className="md:text-xl text-base font-semibold text-center">
                        {item.data.name}
                      </p>
                      <div className="flex gap-5 lg:text-base text-sm ">
                        <p className="flex gap-1 justify-center items-center">
                          <FaStar className="text-yellow-400" />
                          {subStrFunc(item.data.user_ratings)}
                        </p>
                        <p>
                          <b>{item.data.num_servings}</b> Servings
                        </p>
                      </div>
                    </Link>
                  );
                }
              })}
            </div>
          ) : (
            <div className="w-full flex justify-center items-center h-[40vh]">
              <h1 className="text-4xl font-bold text-slate-300">
                Recipe Not Found :(
              </h1>
            </div>
          )}
          <div className="join w-full flex justify-center mt-14">
            {itemOfShow.end / 8 > 2 ? (
              <button className="join-item btn" onClick={()=>{setItemOfShow({start : 0 , end : 8})}}>1</button>
            ) : (
              ""
            )}
            {itemOfShow.end / 8 > 3 ? (
              <button className="join-item btn disabled bg-transparent border-none">
                ...
              </button>
            ) : (
              ""
            )}
            {pagination.map((item: any, i: number) => {
              if (
                itemOfShow.end / 8 == item ||
                itemOfShow.end / 8 == item - 1 ||
                itemOfShow.end / 8 == item + 1
              ) {
                return (
                  <button
                    className={`join-item btn ${
                      itemOfShow.end / 8 == item
                        ? "bg-slate-500 text-white"
                        : ""
                    }`}
                    key={i}
                    onClick={() =>
                      setItemOfShow({ start: item * 8 - 8, end: item * 8 })
                    }
                  >
                    {item}
                  </button>
                );
              }
            })}
            {itemOfShow.end / 8 < paginationLength() - 2 ? (
              <button className="join-item btn disabled bg-transparent border-none">
                ...
              </button>
            ) : (
              ""
            )}
            {itemOfShow.end / 8 < paginationLength() - 1 ? (
              <button className="join-item btn" onClick={()=>{setItemOfShow({start :  paginationLength() * 8 - 8, end : paginationLength() * 8})}}>15</button>
            ) : (
              ""
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default RecipesList;
