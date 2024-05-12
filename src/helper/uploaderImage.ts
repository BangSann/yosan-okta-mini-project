import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";

export async function uploadImage(profileImage : any) {
    if (profileImage) {
      const storageRef = ref(storage, `/post/${profileImage.name}`);
      await uploadBytes(storageRef, profileImage);
      const imgUrl = await getDownloadURL(storageRef);

      return imgUrl;
    } else {
      return "";
    }
  }