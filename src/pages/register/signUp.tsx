import Input from "./input";
import profileImageAlt from "../../assets/profile-image.png";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import writeImageInCanvas from "../../helper/imageRenderer";
import { SubmitHandler, useForm } from "react-hook-form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Swal from "sweetalert2";

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  // profileImg: string;
};

const SignUp = () => {
  const [profileImage, setProfileImage] = useState<any>();

  async function uploadImage() {
    if (profileImage) {
      const storageRef = ref(storage, `/post/${profileImage.name}`);
      await uploadBytes(storageRef, profileImage);
      const imgUrl = await getDownloadURL(storageRef);

      return imgUrl;
    } else {
      return "";
    }
  }

  async function handelDb(uid: string, data: any) {
    await uploadImage().then(async (img) => {
      console.log(img);

      await addDoc(collection(db, "users"), {
        id: uid,
        email: data.email,
        fullName: data.firstName + " " + data.lastName,
        name: data.firstName,
        password: data.password,
        profileImg: img as string,
      })
        .then((user) => {
          console.log(user.id);
        })
        .catch((err) => {
          alert(err);
        });
    });
  }

  function handleSingUp(data: any) {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        // console.log(userCredential.user.uid);
        handelDb(userCredential.user.uid, data);
      })
      .catch((err) => {
        Swal.fire({
          icon : "error",
          text : "Email already used !"
        })
      });
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => handleSingUp(data);

  function inputImageOnChange(event: any) {
    setProfileImage(event.target.files[0]);
    writeImageInCanvas(event.target.files[0], "profileCanvasImage");
  }

  const password = useRef({});
  password.current = watch("password", "");

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
                className="rounded-[20px]"
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
          <form
            action=""
            className="flex flex-col gap-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-2 gap-10">
              <Input
                register={{
                  ...register("firstName", {
                    required: "First name cannot empty !",
                    maxLength: { value: 20, message: "First name to long" },
                  }),
                }}
                error={errors.firstName?.message}
                childern="First Name"
                type="text"
              />
              <Input
                register={{
                  ...register("lastName", {
                    required: "Last name cannot empty !",
                    maxLength: { value: 30, message: "Last name to long" },
                  }),
                }}
                error={errors.lastName?.message}
                childern="Last Name"
                type="text"
              />
            </div>
            <Input
              register={{
                ...register("email", {
                  required: "Email cannot empty",
                  pattern: {
                    value: /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/,
                    message: "Please input valid email !",
                  },
                }),
              }}
              error={errors.email?.message}
              childern="Email"
              type="email"
            />
            <Input
              register={{
                ...register("password", {
                  required: "Password cannot empty !",
                  minLength: {
                    value: 8,
                    message: "Password to short, minimum 8 !",
                  },
                }),
              }}
              error={errors.password?.message}
              childern="Password"
              type="password"
            />
            <Input
              register={{
                ...register("confirmPassword", {
                  required: {
                    value: true,
                    message: "Please confirm your password first !!",
                  },
                  validate: (value) =>
                    value === password.current || "The passwords do not match",
                }),
              }}
              error={errors.confirmPassword?.message}
              childern="Confirm Password"
              type="password"
            />
            <div className="flex items-center gap-5 justify-end mt-12">
              <p className="text-xl font-light">
                Already have an account ?{" "}
                <Link
                  to={"/login"}
                  className="text-blue-600 underline font-medium"
                >
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
