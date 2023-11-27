import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";

import ListingCard from "../components/ListingCard";

const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(`/api/listing/search?offer=true&limit=4`);
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.error(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch(`/api/listing/search?type=rent&limit=4`);
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(`/api/listing/search?type=sale&limit=4`);
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <section className="w-full max-w-6xl mx-auto min-h-screen py-4">
      <div className="my-20 px-4 flex flex-col items-start justify-center gap-5">
        <h1 className="text-2xl md:text-4xl font-bold">
          Discover Your Ideal Home with Convenience
        </h1>
        <div className="text-slate-700">
          <p>
            D'Estate makes finding your perfect home a quick, simple, and
            enjoyable experience.
          </p>
          <p>Our dedicated experts are ready to assist you at every step.</p>
        </div>
        <Link
          to={"/search"}
          className="text-cyan-700 font-semibold bg-slate-400/50 p-2 rounded-md
          hover:bg-cyan-700 hover:text-slate-100 transition-all duration-300 mt-5"
        >
          Let's start now
        </Link>
      </div>
      <div className="w-full h-[400px] bg-cyan-800 overflow-hidden">
        <Swiper navigation>
          {offerListings.map((offer) => (
            <SwiperSlide key={offer._id}>
              <div className="w-full h-[500px]">
                <img
                  src={offer.imageUrls[0]}
                  alt="listing image"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="w-full p-4 flex flex-col justify-center items-center gap-5">
        <div>
          <div className="w-full flex items-center justify-between p-4">
            <h2 className="text-xl">Recent Offers</h2>
            <Link
              to={`/search?offer=true`}
              className="border-b-2 hover:border-cyan-800 text-sm transition-all duration-200"
            >
              Show more
            </Link>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-5 flex-wrap">
            {offerListings.map((offer) => (
              <Link key={offer._id} to={`/listing/${offer._id}`}>
                <ListingCard listing={offer} />
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="w-full flex items-center justify-between p-4">
            <h2 className="text-xl">Recent For Rent</h2>
            <Link
              to={`/search?type=rent`}
              className="border-b-2 hover:border-cyan-800 text-sm transition-all duration-200"
            >
              Show more
            </Link>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-5 flex-wrap">
            {rentListings.map((rent) => (
              <Link key={rent._id} to={`/listing/${rent._id}`}>
                <ListingCard listing={rent} />
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="w-full flex items-center justify-between p-4">
            <h2 className="text-xl">Recent For Sale</h2>
            <Link
              to={`/search?type=sale`}
              className="border-b-2 hover:border-cyan-800 text-sm transition-all duration-200"
            >
              Show more
            </Link>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-5 flex-wrap">
            {saleListings.map((sale) => (
              <Link key={sale._id} to={`/listing/${sale._id}`}>
                <ListingCard listing={sale} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
