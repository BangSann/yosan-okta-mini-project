import Input from "../../componets/input";
import profileImageAlt from "../../assets/profile-image.png";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import writeImageInCanvas from "../../helper/imageRenderer";
import { SubmitHandler, useForm } from "react-hook-form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import Swal from "sweetalert2";
import { uploadImage } from "../../helper/uploaderImage";

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
  const [isLoading, setIsLoading] = useState(false);

  async function handelDb(uid: string, data: any) {
    await uploadImage(profileImage).then(async (img) => {
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

  async function handleSingUp(data: any) {
    setIsLoading(true);
    await createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        // console.log(userCredential.user.uid);
        handelDb(userCredential.user.uid, data);
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          text: "Email already used !",
        });
      });
    setIsLoading(false);
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
    <section className="w-full min-h-[100vh] flex flex-col justify-center items-center gap-12 mb-10">
      <h1 className="font-bold text-6xl mt-14">Register</h1>
      <div className="grid lg:grid-cols-5 grid-cols-1 md:w-[80%] w-[90%]">
        <div className="lg:col-span-2 flex justify-center items-start p-10">
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
        <div className="lg:col-span-3 p-2 xl:ps-8">
          <form
            action=""
            className="flex flex-col gap-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid md:grid-cols-2 grid-cols-1 md:gap-10 gap-3">
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
              type="text"
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
            <div className="md:flex md:flex-row-reverse items-center gap-5 justify-start mt-12">
              <button
                type="submit"
                className="btn py-3 px-16 text-2xl font-semibold text-white bg-[#05FF00] h-auto rounded-[30px] w-full md:w-auto"
                disabled={isLoading}
              >
                {isLoading ? "Waiting" : "Submit"}
              </button>
              <p className="text-xl font-light text-center mt-2 md:mt-0">
                Already have an account ?{" "}
                <Link
                  to={"/login"}
                  className="text-blue-600 underline font-medium"
                >
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
