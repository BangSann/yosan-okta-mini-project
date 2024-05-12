import { useDispatch, useSelector } from "react-redux";
import profileAlt from "../../assets/profile-image.png";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { setUser } from "../../slice/user.slice";
import { uploadImage } from "../../helper/uploaderImage";
import writeImageInCanvas from "../../helper/imageRenderer";

type Inputs = {
  name: string;
  fullName: string;
  email: string;
  oldPassword: string;
  newPassword: string;
  // profileImg: string;
};

const EditProfile = () => {
  const dataUser = useSelector((state: any) => state.user.user);
  const [tempImg, setTempImg] = useState<any>();
  const [userEdited, setUserEdited] = useState<any>({
    id: dataUser.id,
    email: dataUser.email,
    fullName: dataUser.fullName,
    name: dataUser.name,
    oldPassword: dataUser.password,
    newPassword: "",
    profileImg: dataUser.profileImg,
  });

  const password = useRef({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  password.current = userEdited.oldPassword;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => handleEditData(data);

  async function fakeRealtime() {
    const datas = await getDocs(
      query(collection(db, "users"), where("id", "==", userEdited.id))
    );

    datas.forEach(async (doc: any) => {
      dispatch(setUser(doc.data()));
    });
  }

  async function handleEditData(data: any) {
    const datas = await getDocs(
      query(collection(db, "users"), where("id", "==", userEdited.id))
    );

    const imgUrl = await uploadImage(tempImg);
    console.log(imgUrl);

    datas.forEach(async (doc: any) => {
      const docRef = doc.ref;

      await updateDoc(docRef, {
        email: data.email,
        fullName: data.fullName,
        name: data.name,
        password: data.newPassword,
        profileImg: imgUrl || userEdited.profileImg,
      })
        .then(() => {
          fakeRealtime();
          Swal.fire({
            icon: "success",
            text: "Data Updated",
          });
          navigate("/");
        })
        .catch((err: any) => {
          alert(err);
        });
    });
  }

  useEffect(() => {
    if (tempImg) {
      writeImageInCanvas(tempImg, "editProfileImg");
    }
  }, [tempImg]);

  return (
    <section className="w-full flex justify-center">
      <div className="container p-2 flex flex-col justify-center items-center w-full gap-5 my-10">
        <div className="flex flex-col items-center justify-center gap-5">
          {tempImg ? (
            <canvas
              id="editProfileImg"
              width={300}
              height={300}
              className="rounded-[20px]"
            ></canvas>
          ) : (
            <img
              src={userEdited.profileImg || profileAlt}
              alt="profile image"
              className="w-[200px] h-[200px] rounded-full"
            />
          )}
          <input
            type="file"
            id="editProfileImage"
            className="hidden"
            onChange={(event: any) => setTempImg(event.target.files[0])}
          />
          <button
            className="btn bg-[#d9d9d9] text-white rounded-[20px] py-4 text-2xl font-bold h-auto"
            onClick={() => {
              document.getElementById("editProfileImage")?.click();
            }}
          >
            Change Profile Image
          </button>
        </div>
        <form action="" className="w-[70%]" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-5">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text text-xl">Name</span>
              </div>
              <input
                {...register("name", {
                  required: "this field cannot empty",
                  maxLength: {
                    value: 10,
                    message: " your name to long",
                  },
                })}
                type="text"
                placeholder="Type here"
                className={`input input-bordered w-full rounded-3xl py-8 border-2 text-lg ${
                  errors.name?.message ? "border-red-600" : ""
                }`}
                value={userEdited.name}
                onChange={(event) => {
                  setUserEdited((prev: any) => ({
                    ...prev,
                    name: event.target.value,
                  }));
                }}
              />
              {errors.name?.message ? (
                <div className="label">
                  <span className="label-text-alt text-red-600 px-2 text-sm">
                    {errors.name?.message}
                  </span>
                </div>
              ) : (
                ""
              )}
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text text-xl">Email</span>
              </div>
              <input
                {...register("email", {
                  required: "this field cannot empty",
                })}
                type="text"
                placeholder="Type here"
                className={`input input-bordered w-full rounded-3xl py-8 border-2 text-lg`}
                value={userEdited.email}
                readOnly
              />
            </label>
          </div>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-xl">Full Name</span>
            </div>
            <input
              {...register("fullName", {
                required: "this field cannot empty",
                pattern: {
                  value: /^[a-zA-Z]+(?: [a-zA-Z]+)*$/,
                  message: "Invalid full name",
                },
              })}
              type="text"
              placeholder="Type here"
              className={`input input-bordered w-full rounded-3xl py-8 border-2 text-lg ${
                errors.fullName?.message ? "border-red-600" : ""
              }`}
              value={userEdited.fullName}
              onChange={(event) => {
                setUserEdited((prev: any) => ({
                  ...prev,
                  fullName: event.target.value,
                }));
              }}
            />
            {errors.fullName?.message ? (
              <div className="label">
                <span className="label-text-alt text-red-600 px-2 text-sm">
                  {errors.fullName?.message}
                </span>
              </div>
            ) : (
              ""
            )}
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-xl">Input An Old Password</span>
            </div>
            <input
              {...register("oldPassword", {
                required: "this field cannot empty",
                validate: (value) =>
                  value === password.current || "Your old password is wrong",
              })}
              type="password"
              placeholder="Type here"
              className={`input input-bordered w-full rounded-3xl py-8 border-2 text-lg ${
                errors.oldPassword?.message ? "border-red-600" : ""
              }`}
            />
            {errors.oldPassword?.message ? (
              <div className="label">
                <span className="label-text-alt text-red-600 px-2 text-sm">
                  {errors.oldPassword?.message}
                </span>
              </div>
            ) : (
              ""
            )}
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-xl">New Password</span>
            </div>
            <input
              {...register("newPassword", {
                required: "this field cannot empty",
                minLength: {
                  value: 8,
                  message: "your password is to short",
                },
              })}
              type="password"
              placeholder="Type here"
              className={`input input-bordered w-full rounded-3xl py-8 border-2 text-lg ${
                errors.newPassword?.message ? "border-red-600" : ""
              }`}
            />
            {errors.newPassword?.message ? (
              <div className="label">
                <span className="label-text-alt text-red-600 px-2 text-sm">
                  {errors.newPassword?.message}
                </span>
              </div>
            ) : (
              ""
            )}
          </label>

          <button
            type="submit"
            className="btn text-3xl text-white bg-[#FFD600] rounded-[30px] py-4 h-auto mt-5 w-full"
          >
            Change
          </button>
          <p className="px-5 text-end w-full mt-2">Cancel updating profile? <Link to={"/profile"} className="underline text-blue-600">Back to profile</Link></p>
        </form>
      </div>
    </section>
  );
};

export default EditProfile;
