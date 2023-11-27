import { MapPin } from "lucide-react";

const ListingCard = ({ listing }) => {
  return (
    <div className="w-[400px] md:w-[250px] h-[280px] shadow-sm shadow-black/50 rounded-md overflow-hidden">
      <img
        src={listing.imageUrls[0]}
        alt={listing.name}
        className="hover:scale-105 transition-all duration-300 w-full h-[160px] object-cover"
      />
      <div className="p-2 flex flex-col">
        <h2 className="text-sm text-cyan-800 font-semibold mb-1">
          {listing.name}
        </h2>
        <p className="text-xs whitespace-nowrap text-ellipsis overflow-hidden flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {listing.address}
        </p>
        <p className="text-xs whitespace-nowrap text-ellipsis overflow-hidden">
          {listing.description}
        </p>
        <div className="flex items-center gap-2 mb-1">
          <p className="text-xs font-semibold">{listing.bedrooms} beds</p>
          <p className="text-xs font-semibold">{listing.bathrooms} baths</p>
        </div>
        {listing.rent ? (
          listing.offer ? (
            <div className="flex items-center gap-1">
              <p className="text-sm text-cyan-800 font-bold">For rent: </p>
              <p className="text-sm text-cyan-800 font-bold">
                {listing.discountedPrice.toLocaleString()}{" "}
                <span className="line-through text-xs text-gray-500">
                  {listing.regularPrice.toLocaleString()}
                </span>{" "}
                / month
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <p className="text-sm text-cyan-800 font-bold">For rent: </p>
              <p className="text-sm text-cyan-800 font-bold">
                {listing.regularPrice.toLocaleString()} / month
              </p>
            </div>
          )
        ) : listing.offer ? (
          <div className="flex items-center gap-1">
            <p className="text-sm text-cyan-800 font-bold">For sale: </p>
            <p className="text-sm text-cyan-800 font-bold">
              ${listing.discountedPrice.toLocaleString()}{" "}
              <span className="line-through text-xs text-gray-500">
                ${listing.regularPrice.toLocaleString()}{" "}
              </span>
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <p className="text-sm text-cyan-800 font-bold">For sale: </p>
            <p className="text-sm text-cyan-800 font-bold">
              ${listing.regularPrice.toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingCard;
