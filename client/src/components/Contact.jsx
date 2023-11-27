import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listingData }) => {
  const [showForm, setShowForm] = useState(false);
  const [Landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listingData.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLandlord();
  }, [listingData.userRef]);

  return (
    <form className="flex flex-col justify-center gap-3 w-full max-w-[990px] mx-auto">
      {showForm && (
        <>
          <p className="ps-2">
            Contact <span className="font-semibold">{Landlord.username}</span>{" "}
            for the <span className="font-semibold">{listingData.name}</span>
          </p>
          <textarea
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-20 rounded-md resize-none p-1"
          />
        </>
      )}
      {showForm ? (
        <Link
          to={`mailto:${Landlord.email}?subject=Regarding ${listingData.name}&body=${message}`}
          className="border-2 border-slate-600 p-2 rounded-md hover:bg-cyan-600
              hover:border-cyan-600 font-semibold w-full max-w-[600px] mx-auto text-center"
        >
          Send Message
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="border-2 border-slate-600 p-2 rounded-md hover:bg-cyan-600
              hover:border-cyan-600 font-semibold w-full max-w-[600px] mx-auto"
        >
          Contact Landlord
        </button>
      )}

      {showForm && (
        <button
          type="button"
          onClick={() => (setShowForm(false), setMessage(""))}
          className="border-2 border-slate-600 p-2 rounded-md hover:bg-cyan-600
                  hover:border-cyan-600 font-semibold w-full max-w-[600px] mx-auto"
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default Contact;
