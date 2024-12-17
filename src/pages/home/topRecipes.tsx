import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import { subStrFunc } from "../../helper/subStrFunc";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const TopRecipes = () => {
  const [topRecipes, setTopRecipes] = useState<any>([]);

  const dataTopRecipes = async () => {
    const recipes: any[] = [];
    const data = await getDocs(
      query(
        collection(db, "recipes"),
        orderBy("user_ratings", "desc"),
        limit(2)
      )
    );
    data.forEach((doc: any) => {
      recipes.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    setTopRecipes(recipes);
  };

  useEffect(() => {
    dataTopRecipes();
  }, []);
  return (
    <section className="container p-2 flex flex-col justify-center items-center">
      <h1 className="text-5xl mb-32">Top Recipes</h1>
      <div className="xl:w-[80%] flex flex-col gap-12 px-5">
        {topRecipes.map((items: any, i: number) => {
          if (i !== 1) {
            return (
              <div key={i} className="grid md:grid-cols-5 grid-cols-1 gap-5 h-auto">
                <div className="md:col-span-2">
                  <img
                    src={items.data.thumbnail_url}
                    alt="recipe image"
                    className="w-full rounded-3xl"
                  />
                </div>
                <div className="md:col-span-3 xl:py-5 flex flex-col gap-5 w-full relative">
                  <Link
                    to={`/recipes-list/${items.id}`}
                    className="xl:text-5xl lg:text-3xl text-3xl font-semibold text-center md:text-start"
                  >
                    {items.data.name}
                  </Link>
                  <p className="lg:text-base text-sm font-light text-justify">
                    {items.data.description}
                  </p>
                  <div className="flex gap-5 lg:text-2xl text-xl lg:absolute bottom-5 w-full justify-center md:justify-start">
                    <p>
                      <b>{items.data.num_servings}</b> servings
                    </p>
                    <p className="flex gap-2 justify-center items-center">
                      <FaStar className="text-yellow-400" />
                      {subStrFunc(items.data.user_ratings)}
                    </p>
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div key={i} className="grid md:grid-cols-5 grid-cols-1 gap-5 h-auto relative">
                <div className="md:col-span-2 md:hidden">
                  <img
                    src={items.data.thumbnail_url}
                    alt="recipe image"
                    className="w-full rounded-3xl"
                  />
                </div>
                <div className="md:col-span-3 xl:py-5 flex flex-col gap-5 w-full">
                  <Link
                    to={`/recipes-list/${items.id}`}
                    className="xl:text-5xl lg:text-3xl text-3xl font-semibold text-center md:text-start"
                  >
                    {items.data.name}
                  </Link>
                  <p className="lg:text-base text-sm font-light text-justify ">
                    {items.data.description}
                  </p>
                  <div className="flex gap-5 lg:text-2xl text-xl lg:absolute bottom-5 w-full justify-center md:justify-start">
                    <p>
                      <b>{items.data.num_servings}</b> servings
                    </p>
                    <p className="flex gap-2 justify-center items-center">
                      <FaStar className="text-yellow-400" />
                      {subStrFunc(items.data.user_ratings)}
                    </p>
                  </div>
                </div>
                <div className="md:col-span-2 hidden md:block">
                  <img
                    src={items.data.thumbnail_url}
                    alt="recipe image"
                    className="w-full rounded-3xl"
                  />
                </div>
              </div>
            );
          }
        })}
      </div>
    </section>
  );
};

export default TopRecipes;
