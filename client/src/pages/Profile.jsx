import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { Loader2 } from "lucide-react";

import { app } from "../config/firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailed,
  deleteAccountStart,
  deleteAccountSuccess,
  deleteAccountFailed,
  signOutStart,
  signOutSuccess,
  signOutFailed,
} from "../redux/user/userSlice";

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const imageRef = useRef(null);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [showListingError, setShowListingError] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [listingData, setListingData] = useState([]);

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

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailed(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUploadProgress(0);
      alert("Profile has been updated!");
    } catch (error) {
      dispatch(updateUserFailed(error.message));
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    try {
      dispatch(deleteAccountStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteAccountFailed(data.message));
        return;
      }

      dispatch(deleteAccountSuccess(data));
    } catch (error) {
      dispatch(deleteAccountFailed(error.message));
    }
  };

  const handleSignOut = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("api/auth/signout");
      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutFailed(data.message));
        return;
      }

      dispatch(signOutSuccess(data));
    } catch (error) {
      dispatch(signOutFailed(error.message));
    }
  };

  const handleShowListings = async (e) => {
    e.preventDefault();

    try {
      setShowListingError(null);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();

      if (data.success === false) {
        return setShowListingError(data.message);
      }

      setListingData(data);
    } catch (error) {
      setShowListingError(error.message);
    }
  };

  const handleHideListings = (e) => {
    e.preventDefault();
    setListingData([]);
  };

  const handleDeleteListing = async (id) => {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setListingData((prev) => prev.filter((listing) => listing._id !== id));
    } catch (error) {
      console.log(error.message);
    }
  };

  if (error) {
    alert(error);
  }

  return (
    <section className="w-full min-h-screen flex flex-col items-center gap-5">
      <h1 className="text-2xl mt-10">Profile</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[400px] flex flex-col items-center gap-3"
      >
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={imageRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => imageRef.current.click()}
          src={currentUser.profileImage}
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
          name="username"
          defaultValue={currentUser.username}
          onChange={(e) =>
            setUserDetails({ ...userDetails, username: e.target.value })
          }
          className="border w-full p-2 rounded-md outline-none focus:outline-cyan-400"
        />
        <input
          type="email"
          name="email"
          defaultValue={currentUser.email}
          onChange={(e) =>
            setUserDetails({ ...userDetails, email: e.target.value })
          }
          className="border w-full p-2 rounded-md outline-none focus:outlinecyan-400"
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          onChange={handleChange}
          className="border w-full p-2 rounded-md outline-none focus:outline-cyan-400"
        />
        <button
          disabled={loading}
          className="w-full bg-slate-500 p-2 rounded-md capitalize text-white
          hover:bg-slate-600"
        >
          {loading ? (
            <div className="flex justify-center items-center gap-2">
              Updating
              <Loader2 className="animate-spin transition-all duration-300" />
            </div>
          ) : (
            "update"
          )}
        </button>
        <Link
          to="/create-listing"
          className="border-2 border-slate-600 w-full p-2 rounded-md capitalize font-medium
          hover:bg-cyan-500 hover:border-cyan-500 transition-all duration-300 text-center"
        >
          create listing
        </Link>
      </form>
      <div className="w-full max-w-[400px] flex items-center justify-between">
        <button
          onClick={handleDeleteAccount}
          className="text-red-500 font-medium capitalize 
          hover:border-b-red-500 border-b-2 border-b-transparent"
        >
          delete account
        </button>
        <button
          onClick={handleSignOut}
          className="capitalize font-medium hover:bg-slate-400 hover:text-white p-1 rounded-md
          bg-transparent text-black"
        >
          sign out
        </button>
      </div>
      <div className="w-full max-w-[400px] flex flex-col items-center gap-5">
        {listingData.length === 0 ? (
          <button onClick={handleShowListings} className="text-cyan-800">
            Show Listings
          </button>
        ) : (
          <button onClick={handleHideListings} className="text-cyan-800">
            Hide Listings
          </button>
        )}

        {showListingError && (
          <p className="border-2 border-red-500 w-full p-2 rounded-md text-red-500 text-center">
            {showListingError}
          </p>
        )}

        {listingData.length !== 0 && (
          <>
            <h2 className="text-2xl font-semibold">Your Listings</h2>
            {listingData.map((listing) => (
              <div
                key={listing._id}
                className="w-full border-2 border-cyan-500 rounded-md p-2 flex items-center
                justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={listing.imageUrls[0]}
                    alt={listing.name}
                    className="w-28 h-30 object-cover"
                  />
                  <Link
                    to={`/listing/${listing._id}`}
                    className="cursor-pointer border-b-2 border-b-transparent hover:border-b-cyan-500
                    hover:text-cyan-800 transition-all duration-300"
                  >
                    {listing.name}
                  </Link>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <Link
                    to={`/update-listing/${listing._id}`}
                    className="text-cyan-800"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteListing(listing._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default Profile;
