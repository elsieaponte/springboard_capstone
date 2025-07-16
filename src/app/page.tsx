"use client";
import toast from "react-hot-toast";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  const [allParks, setAllParks] = useState<any[]>([]);
  const [filteredParks, setFilteredParks] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");
  const [visitedParkIds, setVisitedParkIds] = useState<string[]>([]);

  const parksPerPage = 30;

  //pagination - calculations for indexes for slicing 
  const indexOfLastPark = currentPage * parksPerPage;
  const indexOfFirstPark = indexOfLastPark - parksPerPage;
  const currentParks = filteredParks.slice(indexOfFirstPark, indexOfLastPark);
  const totalPages = Math.ceil(filteredParks.length / parksPerPage);

  //gets park details from the api 
  const getParkDetails = async () => {
    try {

      const response = await axios.get("/api/parks");
      const parks = response.data.data;

      setAllParks(parks);
      setFilteredParks(parks);

      //get all the unique state codes
      const uniqueStates = Array.from(
        new Set(parks.flatMap((park: any) => park.states.split(",").map((s: string) => s.trim())))).sort();

      setStates(uniqueStates);

    } catch (error: any) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    getParkDetails();
  }, []);

  //pagination - control functions
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  //check if the user is logged in
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get("/api/users/me")
        if (res.data?.data?._id) {
          setisLoggedIn(true)
          setUserId(res.data.data._id)
          const visitedIds = res.data.data.visitedParks?.map((p: any) => p.parkId || [])
          setVisitedParkIds(visitedIds)
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    }
    checkLogin()
  }, [])

  //onclick function for marked as visited
  const markVisited = async (park: any) => {
    try {
      const res = await axios.post("/api/users/visited", {
        parkId: park.parkCode,
        parkName: park.fullName,
        imageUrl: park.images?.[0].url,
      })

      if (res.data.success) {
        toast.success(`Marked ${park.fullName} as visited!`)
        setVisitedParkIds(prev => [...prev, park.parkCode])
      }
    } catch (error: any) {
      toast.error("Failed to mark as visited");
    }
  }

  return (
    <div>
      {/* filter drop down for states */}
      {states.length > 0 && (
        <select
          className="ml-5 bg-[rgba(72,51,11,1)] text-white px-3 py-2 border border-white rounded "
          value={selectedState}
          onChange={(e) => {
            const state = e.target.value;
            setSelectedState(state);
            setCurrentPage(1);

            if (state === "") {
              setFilteredParks(allParks);
            } else {
              const filtered = allParks.filter((park) =>
                park.states.split(",").map((s: string) => s.trim()).includes(state));
              setFilteredParks(filtered);
            }
          }}>
          {/* filter drop down */}
          <option value="">Filter by State</option>
          {states.map((state) => (
            <option
              key={state}
              value={state}>
              {state}
            </option>
          ))}
        </select>

      )}

      {/* display list of national parks from a particular state */}
      <div>
        {currentParks.length > 0 ? (
          currentParks.map((park, index) => (
            <div key={park.id || index} className="relative border p-4 my-2 mx-4 rounded shadow flex flex-col md:flex-row gap-4">
              <div>
                <img
                  src={park.images[0].url}
                  alt={park.images[0].altText || "Park Image"}
                  onClick={() => router.push(`/park/${park.parkCode}`)}
                  className="w-100 max-w-md h-auto object-cover rounded mb-2 border border-white cursor-pointer" />
                <p>Credit: {park.images[0].credit}</p>
              </div>
              <div>
                <h2 className="font-bold mb-4">{park.fullName} {park.designation === "" ? "" : `: ${park.designation}`}</h2>
                <p className="mb-4">{park.description}</p>
                <a href={park.url}
                  className="hover:text-white">Visit Official Website</a>
              </div>
              <div className="absolute bottom-4 right-4">
                {isLoggedIn && (
                  <button
                    onClick={() => markVisited(park)}
                    className="text-xs cursor-pointer border border-white py-2 px-4 rounded bg-[rgba(72,51,11,1)] text-white"
                  >
                    {visitedParkIds.includes(park.parkCode) ? "Marked" : "I've been here!"}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="border-4 border-[#B1AB86] rounded-lg p-8 shadow-lg text-center">
              <p className="text-lg font-semibold mb-2">...Loading National Parks</p>
            </div>
          </div>
        )}
      </div>

      {/* pagination */}
      <div className="flex justify-center gap-4 my-4">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="border rounded py-2 px-4 bg-[#B1AB86] hover:bg-[#819067] hover:text-white"
        >Previous
        </button>
        <span className="px-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="border rounded py-2 px-4 bg-[#B1AB86] hover:bg-[#819067] hover:text-white"
        >
          Next
        </button>
      </div>
    </div>
  );
}
