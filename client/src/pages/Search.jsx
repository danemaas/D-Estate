import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import debounce from "lodash/debounce";

import ListingCard from "../components/ListingCard";

const Search = () => {
  const searchTerm = new URLSearchParams(location.search).get("searchTerm");
  const navigate = useNavigate();

  const [queries, setQueries] = useState({
    type: "all",
    offer: false,
    parking: false,
    furnished: false,
    sort: "createdAt",
    order: "desc",
  });

  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", searchTerm);
    urlParams.set("type", queries.type);
    urlParams.set("offer", queries.offer);
    urlParams.set("parking", queries.parking);
    urlParams.set("furnished", queries.furnished);
    urlParams.set("sort", queries.sort);
    urlParams.set("order", queries.order);

    const res = await fetch(`/api/listing/search?${urlParams}`);
    const data = await res.json();
    setSearchResults(data);
  };

  const debouncedSearch = debounce(handleSearch, 300);

  useEffect(() => {
    debouncedSearch();
  }, [queries]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (["all", "rent", "sale"].includes(name)) {
      setQueries({ ...queries, type: name });
    } else if (["parking", "furnished", "offer"].includes(name)) {
      setQueries({ ...queries, [name]: checked });
    } else if (name === "sort_order") {
      const [sort = "createdAt", order = "desc"] = value.split("_");
      setQueries({ ...queries, sort, order });
    }
  };

  return (
    <section className="w-full min-h-screen flex flex-col md:flex-row gap-2">
      <div className="w-full max-w-[400px] p-3">
        <form
          onSubmit={handleSearch}
          className="flex flex-col items-start justify-center gap-3"
        >
          <p className="ps-2 font-medium">Type:</p>
          <div className="w-full flex items-center gap-5 border-2 border-slate-700/50 p-2 rounded-md">
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                name="all"
                className="cursor-pointer"
                checked={queries.type === "all"}
                onChange={handleChange}
              />
              <label className="text-sm">Rent & Sale</label>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                name="rent"
                className="cursor-pointer"
                checked={queries.type === "rent"}
                onChange={handleChange}
              />
              <label className="text-sm">Rent</label>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                name="sale"
                className="cursor-pointer"
                checked={queries.type === "sale"}
                onChange={handleChange}
              />
              <label className="text-sm">Sale</label>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                name="offer"
                className="cursor-pointer"
                checked={queries.offer}
                onChange={handleChange}
              />
              <label className="text-sm">Offer</label>
            </div>
          </div>
          <p className="ps-2 font-medium">Amenities:</p>
          <div className="w-full flex items-center gap-5 border-2 border-slate-700/50 p-2 rounded-md">
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                name="parking"
                className="cursor-pointer"
                checked={queries.parking}
                onChange={handleChange}
              />
              <label className="text-sm">Parking</label>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                name="furnished"
                className="cursor-pointer"
                checked={queries.furnished}
                onChange={handleChange}
              />
              <label className="text-sm">Furnished</label>
            </div>
          </div>
          <div className="w-full flex items-center gap-5">
            <p className="ps-2 font-medium">Sort:</p>
            <select
              name="sort_order"
              className="bg-transparent p-2 border-2 border-slate-700/50 rounded-md cursor-pointer"
              defaultValue={"createdAt_desc"}
              onChange={handleChange}
            >
              <option value="createdAt_desc">latest</option>
              <option value="createdAt_asc">oldest</option>
              <option value="regularPrice_asc">by price (low)</option>
              <option value="regularPrice_desc">by price (high)</option>
            </select>
          </div>
        </form>
      </div>
      <hr className="border border-slate-700/20 md:min-h-screen" />
      <div className="p-3">
        <h2 className="text-xl mb-5">Search Results:</h2>
        {searchResults.length < 1 ? (
          <div>
            <p>No listings found</p>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            {searchResults.map((result) => (
              <Link key={result._id} to={`/listing/${result._id}`}>
                <ListingCard listing={result} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Search;
