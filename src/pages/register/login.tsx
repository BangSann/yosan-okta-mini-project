import { Link } from "react-router-dom";
import bannerImage from "../../assets/banner-image.png";
import { SubmitHandler, useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import Swal from "sweetalert2";
import { useState } from "react";

type Inputs = {
  email: string;
  password: string;
};

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => handleLogin(data);

  async function handleLogin(data: any) {
    setIsLoading(true);
    await signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential: any) => {
        const user = userCredential;
        console.log(user);
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          text: "Invalid Email or Password",
        });
      });

    setIsLoading(false);
  }

  return (
    <section className="grid lg:grid-cols-2 grid-cols-1 h-[100vh]">
      <div className="lg:flex justify-center items-center hidden">
        <div className="text-center">
          <img src={bannerImage} alt="banner-image" />
          <h1 className="text-8xl font-bold">
            <span className="text-[#05FF00]">Simp</span>cook
          </h1>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center bg-[#ABFF69]">
        <h1 className="text-6xl font-bold text-white mb-14">Login</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="md:w-[60%] w-[80%] flex flex-col gap-5"
        >
          <div className="flex flex-col gap-2 w-full">
            <label className="font-bold md:text-2xl text-base text-white px-5">Email</label>
            <input
              {...register("email", {
                required: { value: true, message: "Please input an email" },
              })}
              type="email"
              placeholder="Type your email...."
              className="px-6 p-4 rounded-[30px] md:text-xl text-base"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="font-bold md:text-2xl text-base text-white px-5">
              Password
            </label>
            <input
              {...register("password", {
                required: { value: true, message: "Please input a password" },
              })}
              type="password"
              className="px-6 p-4 rounded-[30px] text-xl"
            />
          </div>
          <p className="md:px-5 font-semibold xl:text-xl md:text-base text-sm md:text-end text-center text-white">
            Don`t have an account ?{" "}
            <Link to={"/sign-up"} className="underline text-blue-600">
              Sign Up
            </Link>
          </p>
          <button
            type="submit"
            className="btn text-3xl text-white bg-[#FFD600] rounded-[30px] py-4 h-auto mt-5"
            disabled={isLoading}
          >
            {isLoading ? "Waiting" : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
