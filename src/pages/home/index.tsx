import { Link } from "react-router-dom";
import bannerImage from "../../assets/banner-image.png"
import Categories from "./categories";

const Home = () => {
  return (
    <section className="w-full flex flex-col items-center justify-center">
      <div className="container lg:grid lg:grid-cols-2 p-2 lg:items-center flex items-center h-[calc(100vh-80px)]">
        <div className="flex flex-col gap-14">
          <div className="flex flex-col gap-6">
            <h1 className="font-bold text-5xl leading-normal tracking-normal">Every dish tells a story let our recipes be your guide</h1>
            <p className="font-light text-xl">
              Dive into a world of tantalizing flavors, creative concoctions,
              and culinary inspirations that cater to every palate
            </p>
          </div>
          <div>
            <Link to={"recipes-list"} className="btn  py-5 px-11 h-auto bg-[#05FF00] rounded-full text-3xl text-white">Get Started</Link>
          </div>
        </div>
        <div className="justify-center items-center lg:flex hidden">
            <img src={bannerImage} alt="banner-image"  />
        </div>
      </div>
      <Categories/>
      <div className="h-[100vh]">

      </div>
    </section>
  );
};

export default Home;
