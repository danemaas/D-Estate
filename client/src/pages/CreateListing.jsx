import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Loader2, XIcon } from "lucide-react";

import { app } from "../config/firebase";

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState("");
  const [loading, setLoading] = useState(false);
  const [listingData, setListingData] = useState({
    imageUrls: [],
  });

  const handleImageUpload = async () => {
    try {
      setLoading(true);
      if (files.length < 1 || files.length + listingData.imageUrls.length > 6) {
        setLoading(false);
        return setImageUploadError("Please upload 1 to 6 images.");
      }

      const uploadPromises = files.map(storeImage);
      const results = await Promise.allSettled(uploadPromises);

      const successfulUploads = results.map((result) => result.value);

      setListingData({
        ...listingData,
        imageUrls: listingData.imageUrls.concat(successfulUploads),
      });
      setLoading(false);
      setImageUploadError("");
    } catch (error) {
      setImageUploadError(`Error uploading images: ${error.message}`);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        }
      );
    });
  };

  const handleDeleteImage = (e, index) => {
    e.preventDefault();
    setListingData({
      ...listingData,
      imageUrls: listingData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    setListingData({ ...listingData, [e.target.name]: e.target.value });
  };

  return (
    <section className="w-full min-h-screen">
      <h2 className="text-center text-2xl font-semibold py-10">
        Create Listing
      </h2>
      <form
        className="w-full p-3 md:max-w-[1200px] mx-auto flex flex-col md:flex-row
        justify-around md:gap-5"
      >
        <div className="w-full flex flex-col gap-3 mb-5">
          <div className="w-full flex flex-col gap-3">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="w-full border-2 p-2 rounded-md"
                minLength={10}
                maxLength={60}
                required
              />
            </div>
            <div>
              <textarea
                type="text"
                name="description"
                placeholder="Description"
                className="w-full resize-none border-2 p-2 rounded-md"
                required
              />
            </div>
            <div>
              <input
                type="text"
                name="address"
                placeholder="Address"
                className="w-full border-2 p-2 rounded-md"
                required
              />
            </div>
          </div>
          <div className="w-full flex flex-wrap items-center justify-between border-2 p-2 rounded-md">
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                name="furnished"
                className="cursor-pointer"
              />
              <label>Furnished</label>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                name="parking"
                className="cursor-pointer"
              />
              <label>Parking</label>
            </div>
            <div className="flex items-center gap-1">
              <input type="checkbox" name="rent" className="cursor-pointer" />
              <label>Rent</label>
            </div>
            <div className="flex items-center gap-1">
              <input type="checkbox" name="sale" className="cursor-pointer" />
              <label>Sell</label>
            </div>
            <div className="flex items-center gap-1">
              <input type="checkbox" name="offer" className="cursor-pointer" />
              <label>Offer</label>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="bedrooms"
                className="w-20 border-2 p-2 rounded-md"
                min={1}
                max={10}
                required
              />
              <label>Bedrooms</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="bathrooms"
                min={1}
                max={20}
                required
                className="w-20 border-2 p-2 rounded-md"
              />
              <label>Bathrooms</label>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="regularPrice"
              defaultValue={0}
              className=" border-2 p-2 rounded-md"
              required
            />
            <label className="flex flex-col items-center justify-center text-[14px]">
              Regular Price{" "}
              <span className="text-xs font-semibold">($ /month)</span>
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="regularPrice"
              defaultValue={0}
              required
              className=" border-2 p-2 rounded-md"
            />
            <label className="flex flex-col items-center justify-center text-[14px]">
              Discounted Price{" "}
              <span className="text-xs font-semibold">($ /month)</span>
            </label>
          </div>
        </div>
        <div className="w-full flex flex-col gap-3">
          <label>
            <span className="font-semibold">Images:</span> The first image will
            be the cover (max 6)
          </label>
          <div className="w-full flex items-center gap-3">
            <input
              type="file"
              name="imageUrls"
              className="w-full border-2 p-2 rounded-md"
              accept="image/*"
              onChange={(e) => setFiles([...e.target.files])}
              multiple
              required
            />
            <button
              type="button"
              disabled={loading}
              onClick={handleImageUpload}
              className="w-[100px] py-2 border-2 border-cyan-500 rounded-md
              hover:bg-cyan-500 transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center gap-1">
                  Uploading <Loader2 className="animate-spin" />
                </div>
              ) : (
                "Upload"
              )}
            </button>
          </div>
          {imageUploadError && (
            <p className="text-red-500 text-center p-2 border-2 border-red-500 rounded-md">
              {imageUploadError}
            </p>
          )}
          {listingData.imageUrls.length > 0 &&
            listingData.imageUrls.map((imageUrl, index) => (
              <div
                key={index}
                className="w-full bg-green-200 border-2 border-green-400 flex items-center justify-between
                group cursor-pointer rounded-md overflow-hidden p-2"
              >
                <div className="w-32 h-20 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt="listing image"
                    className="w-full h-full object-cover"
                  />
                </div>

                <XIcon
                  type="button"
                  onClick={(e) => handleDeleteImage(e, index)}
                  className="text-red-500 w-max"
                />
              </div>
            ))}
          <button
            className="border-2 p-2 rounded-md uppercase bg-slate-500
            text-white border-slate-500 hover:bg-slate-700 my-5"
          >
            submit listing
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreateListing;
