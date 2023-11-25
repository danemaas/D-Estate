import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../config/firebase";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const imageRef = useRef(null);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [userDetails, setUserDetails] = useState({
    username: currentUser.username,
    email: currentUser.email,
    password: "",
    profileImage: currentUser.profileImage,
  });

  useEffect(() => {
    if (file) {
      handleFileUpload();
    }
  }, [file]);

  const handleFileUpload = () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(Math.round(progress));
      },
      (error) => setUploadError(error.message),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) =>
          setUserDetails({ ...userDetails, profileImage: downloadUrl })
        );
      }
    );
  };

  return (
    <section className="w-full min-h-screen flex flex-col items-center gap-5">
      <h1 className="text-2xl mt-10">Profile</h1>
      <form className="w-full max-w-[400px] flex flex-col items-center gap-3">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={imageRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => imageRef.current.click()}
          src={userDetails.profileImage}
          alt="user image"
          className="rounded-full object-cover w-20 h-20 cursor-pointer"
        />
        {uploadProgress > 0 && uploadProgress < 100 ? (
          <span className="text-slate-700">{`Uploading ${uploadProgress}%`}</span>
        ) : uploadProgress === 100 && !uploadError ? (
          <span className="text-green-700">Image successfully uploaded</span>
        ) : (
          ""
        )}
        <p>{uploadError !== null && uploadError}</p>
        <input
          type="text"
          value={userDetails.username}
          onChange={(e) =>
            setUserDetails({ ...userDetails, username: e.target.value })
          }
          className="border w-full p-2 rounded-md outline-none focus:outline-cyan-400"
        />
        <input
          type="email"
          value={userDetails.email}
          onChange={(e) =>
            setUserDetails({ ...userDetails, email: e.target.value })
          }
          className="border w-full p-2 rounded-md outline-none focus:outlinecyan-400"
        />
        <input
          type="password"
          value={userDetails.password}
          onChange={(e) =>
            setUserDetails({ ...userDetails, password: e.target.value })
          }
          className="border w-full p-2 rounded-md outline-none focus:outline-cyan-400"
        />
        <button
          onClick={() => {}}
          className="w-full bg-slate-500 p-2 rounded-md capitalize text-white
          hover:bg-slate-600"
        >
          update
        </button>
      </form>
      <div className="w-full max-w-[400px] flex items-center justify-between">
        <button
          onClick={() => {}}
          className="text-red-500 font-medium capitalize 
          hover:border-b-red-500 border-b-2 border-b-transparent"
        >
          delete account
        </button>
        <button
          onClick={() => {}}
          className="capitalize font-medium hover:bg-slate-400 hover:text-white p-1 rounded-md
          bg-transparent text-black"
        >
          sign out
        </button>
      </div>
    </section>
  );
};

export default Profile;
