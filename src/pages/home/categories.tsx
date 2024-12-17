import { Link } from "react-router-dom";
import breakfast_logo from "../../assets/categories-logo/breakfast.png";
import vegetarian_logo from "../../assets/categories-logo/vegetarian.png";
import dinner_logo from "../../assets/categories-logo/dinner.png";
import seafood_logo from "../../assets/categories-logo/seafood.png";
import pasta_logo from "../../assets/categories-logo/pasta.png";
import dessert_logo from "../../assets/categories-logo/dessert.png";

const Categories = () => {
  const categoriesList = [
    {
      slug: "breakfast",
      display: "Breakfast",
      logo: breakfast_logo,
    },
    {
      slug: "dinner",
      display: "Dinner",
      logo: dinner_logo,
    },
    {
      slug: "pasta",
      display: "Pasta",
      logo: pasta_logo,
    },
    {
      slug: "vegetarian",
      display: "Vegetariant",
      logo: vegetarian_logo,
    },
    {
      slug: "seafood",
      display: "Seafood",
      logo: seafood_logo,
    },
    {
      slug: "desserts",
      display: "Desserts",
      logo: dessert_logo,
    },
  ];

  return (
    <section className="w-full bg-slate-100 flex flex-col items-center justify-center py-16 gap-12 my-36">
      <div className={`container p-2 grid md:grid-cols-6 grid-cols-1 gap-10`}>
        {categoriesList.map((item, i) => (
          <Link
            to={`/recipes-list?categories=${item.slug}`}
            key={i}
            className="grid md:grid-cols-1 grid-cols-2 justify-center items-center hover:scale-105 gap-4"
          >
            <div className="w-full flex justify-center items-center">
              <img
                src={item.logo}
                alt="logo"
                className="w-3/5 md:min-h-[50px] lg:min-h-[70px] xl:min-h-[100px] object-center"
              />
            </div>
            <div className="text-2xl font-light md:text-center">
              {item.display}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;
