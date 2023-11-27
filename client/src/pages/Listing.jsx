import {
  Loader2,
  BedDouble,
  ShowerHead,
  SofaIcon,
  CarFront,
  MapPin,
  ParkingSquareOff,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";

import Contact from "../components/Contact";

const Listing = () => {
  const listingId = useParams().id;
  const [listingData, setListingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/getListing/${listingId}`);
        const data = await res.json();

        if (data.success === false) {
          setError(data.message);
          setLoading(false);
          return;
        }

        setListingData(data);
        setLoading(false);
      } catch (error) {
        setError(data.message);
        setLoading(false);
      }
    };

    fetchListing();
  }, []);

  return (
    <section className="w-full min-h-screen">
      {loading || !listingData ? (
        <div className="w-full h-[50vh] flex items-center justify-center gap-1 text-xl">
          Loading <Loader2 className="animate-spin w-5 h-5" />
        </div>
      ) : (
        <>
          <Swiper navigation>
            {listingData.imageUrls.map((url, index) => (
              <SwiperSlide key={index}>
                <div className="w-full h-[500px]">
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="w-full max-w-[1200px] mx-auto p-4 flex flex-col justify-center gap-5">
            <p className="text-xl">{listingData.name}</p>
            <p className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-cyan-700" />
              {listingData.address}
            </p>
            <div className="flex items-center gap-2">
              <p className="bg-cyan-800 text-white w-max p-2 rounded-md">
                For {listingData.type}
              </p>
              {listingData.offer && (
                <p className="border-b-2 border-b-cyan-500 font-semibold">
                  ${listingData.discountedPrice.toLocaleString("en-US")}
                  {listingData.type === "rent" && "/ month"}
                </p>
              )}
              <p
                className={`font-semibold ${
                  listingData.offer
                    ? "line-through text-gray-600 text-sm"
                    : "border-b-2 border-b-cyan-500"
                }`}
              >
                ${listingData.regularPrice.toLocaleString("en-US")}
                {listingData.type === "rent" && "/ month"}
              </p>
            </div>

            <p className="text-justify">{listingData.description}</p>
            <ul className="w-full max-w-[500px] flex items-center gap-5">
              <li className="flex items-center gap-1">
                <BedDouble className="text-cyan-700" />
                {listingData.bedrooms > 1 ? (
                  <span>{listingData.bedrooms} beds</span>
                ) : (
                  <span>{listingData.bedrooms} bed</span>
                )}
              </li>
              <li className="flex items-center gap-1">
                <ShowerHead className="text-cyan-700" />
                {listingData.bathrooms > 1 ? (
                  <span>{listingData.bathrooms} baths</span>
                ) : (
                  <span>{listingData.bathrooms} bath</span>
                )}
              </li>
              {listingData.furnished && (
                <li className="flex items-center gap-1">
                  <SofaIcon className="text-cyan-700" /> Furnished
                </li>
              )}
              {listingData.parking ? (
                <li className="flex items-center gap-1">
                  <CarFront className="text-cyan-700" /> Parking
                </li>
              ) : (
                <li className="flex items-center gap-1">
                  <ParkingSquareOff className="text-cyan-700" /> No Parking
                </li>
              )}
            </ul>
            {currentUser && listingData.userRef !== currentUser._id && (
              <Contact listingData={listingData} />
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default Listing;
