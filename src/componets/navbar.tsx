import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <section className="flex justify-center sticky top-0">
      <div className="container navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 text-2xl"
            >
              <li>
                <Link to={"/"}>Home</Link>
              </li>
              <li>
                <a>Recipe</a>
              </li>
              <li>
                <a>Features</a>
                <ul className="p-2">
                  <li>
                    <Link to={"/generator-recipe"}>Image To Recipe</Link>
                  </li>
                </ul>
              </li>
              <li>
                <a>About</a>
              </li>
              <li>
                <button className="btn bg-[#05FF00] py-2 px-14 rounded-3xl text-lg font-semibold text-white mt-4">
                  Login
                </button>
              </li>
            </ul>
          </div>
          <h1 className="btn p-0 btn-ghost text-4xl font-bold gap-0 hover:bg-transparent">
            <p className="text-[#05FF00]">Simp</p>cook
          </h1>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 text-2xl">
            <li className="list-item">
              <Link to={"/"}>Home</Link>
            </li>
            <li className="list-item">
              <a>Recipe</a>
            </li>
            <li className="dropdown list-item">
              <div tabIndex={0} role="button">
                Features
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 ms-0 mt-3 text-xl"
              >
                <li>
                  <Link to={"/generator-recipe"}>Image To Recipe</Link>
                </li>
              </ul>
            </li>
            <li className="list-item">
              <a>About</a>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <button className="btn bg-[#05FF00] py-2 px-14 rounded-3xl text-[24px] font-semibold text-white hidden lg:flex">
            Login
          </button>
        </div>
      </div>
    </section>
  );
};

export default Navbar;
