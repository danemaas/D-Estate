import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";

import "swiper/css/bundle";

const Listing = () => {
  const listingId = useParams().id;
  const [listingData, setListingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      )}
    </section>
  );
};

export default Listing;
