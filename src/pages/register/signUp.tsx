import Input from "./input";
import profileImageAlt from "../../assets/profile-image.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import writeImageInCanvas from "../../helper/imageRenderer";

const SignUp = () => {
  const [profileImage, setProfileImage] = useState("");

  function inputImageOnChange(event: any) {
    setProfileImage(event.target.files[0]);
    writeImageInCanvas(event.target.files[0], "profileCanvasImage");
  }

  return (
    <section className="w-full min-h-[100vh] flex flex-col justify-center items-center gap-12">
      <h1 className="font-bold text-6xl mt-14">Register</h1>
      <div className="grid grid-cols-5 w-[80%]">
        <div className="col-span-2 flex justify-center items-start p-10">
          <div className="flex flex-col gap-7">
            <input
              type="file"
              id="profileImage"
              className="hidden"
              onChange={inputImageOnChange}
            />
            {profileImage ? (
              <canvas
                id="profileCanvasImage"
                width={300}
                height={300}
                className="rounded-full"
              ></canvas>
            ) : (
              <img src={profileImageAlt} alt="profile-image" />
            )}
            <button
              className="btn bg-[#d9d9d9] text-white rounded-[20px] py-4 text-2xl font-bold h-auto"
              onClick={() => document.getElementById("profileImage")?.click()}
            >
              {!profileImage ? "Add Profile Image" : "Change Profile Image"}
            </button>
          </div>
        </div>
        <div className="col-span-3 p-2 ps-8">
          <form action="" className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-10">
              <Input childern="First Name" type="text" />
              <Input childern="Last Name" type="text" />
            </div>
            <Input childern="Email" type="email" />
            <Input childern="Password" type="password" />
            <Input childern="Confirm Password" type="password" />
            <div className="flex items-center gap-5 justify-end mt-12">
              <p className="text-xl font-light">
                Already have an account ?{" "}
                <Link to={"/"} className="text-blue-600 underline font-medium">
                  Login
                </Link>
              </p>
              <button
                type="submit"
                className="btn py-3 px-16 text-2xl font-semibold text-white bg-[#05FF00] h-auto rounded-[30px]"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
