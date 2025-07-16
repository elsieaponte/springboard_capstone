"use client";
import { useState, useEffect } from "react";
import { use } from "react"
import toast from "react-hot-toast";
import ImageCarousel from "@/app/components/ImageCarousel";

export default function ParkPage({ params: paramsPromise }: { params: Promise<{ code: string }> }) {
  const { code } = use(paramsPromise)
  const [park, setPark] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  //get the park details by parkcode
  useEffect(() => {
    const getPark = async () => {
      try {
        const res = await fetch(`/api/parkcode?parkCode=${code}`)
        const results = await res.json()

        if (!results.data || results.data.total === "0") {
          toast.error("Park not found.")
          setLoading(false)
          return
        }

        setPark(results.data.data[0])
        setLoading(false)

      } catch (error: any) {
        toast.error("Failed to load park data.");
        setLoading(false);
      }
    }

    getPark();
  }, [code])

  //loading bar
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="border-4 border-[#B1AB86] rounded-lg p-8 shadow-lg text-center">
          <p className="text-lg font-semibold mb-2">...Loading Park Information</p>
        </div>
      </div>
    )
  }

  if (!park) {
    return <p>Park not found.</p>
  }

  return (
    <>
      {/* shows images related to a specific park */}
      <div>
        <h1 className="text-center font-bold text-4xl mb-4">{park.fullName}</h1>
        {park.images && park.images.length > 0 && <ImageCarousel images={park.images} />}
      </div>

      <h2 className="text-center font-bold text-2xl mb-4">PARK INFORMATION</h2>
      <hr />

      {/* activities */}
      <div className="my-4 mx-2 rounded px-4 py-2">
        <h3 className="font-semibold mb-2">Fun things to do: </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ml-2">
          {Array.from({ length: Math.ceil(park.activities.length / 5) }).map((_, colIndex) => (
            <ul key={colIndex} className="list-disc list-inside">
              {park.activities
                .slice(colIndex * 5, colIndex * 5 + 5)
                .map((activity: any, index: number) => (
                  <li key={index}>{activity.name}</li>
                ))}
            </ul>
          ))}
        </div>
      </div>

      <hr />

      <div className="flex flex-col md:flex-row gap-8 my-4 mx-2">

        {/* operating hours */}
        <div className="flex-1">
          {park.operatingHours?.map((hours: any, index: number) => (
            <div key={index}>
              <h4 className="mb-2 font-bold">{hours.name === 'Operating Hours' ? "" : `${hours.name}`}</h4>
              <p className="mb-2 italic">{hours.description}</p>
              <ul className="mb-2">
                <h2>Operating Hours: </h2>
                {Object.entries(hours.standardHours).map(([day, time]) => (
                  <li key={day}>
                    {day.charAt(0).toUpperCase() + day.slice(1)}: {time as string}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="hidden md:block w-px bg-[#0A400C]" />

        {/* entrance fees */}
        <div className="flex-1">
          <h2 className="mb-2 font-bold">Entrance Fees: </h2>
          {park.entranceFees && park.entranceFees.lenght > 0 ? park.entranceFees.map((fees: any, index: number) => (
            <div key={index}>
              <div className="flex justify-between items-center">
                <h4>{fees.title}</h4>
                <p>${fees.cost}</p>
              </div>
              <p>{fees.description}</p>
            </div>
          )) : (
            <p>Park is free. There are no entrance fees.</p>
          )}

          <h2 className="mb-2 mt-2 font-bold">Weather Information: </h2>
          <p>{park.weatherInfo}</p>
        </div>

        <div className="hidden md:block w-px bg-[#0A400C]" />

        {/* address */}
        <div className="flex-1 mb-3">
          <h2 className="mb-2 font-bold">Park Address: </h2>
          {park.addresses?.map((address: any, index: number) => (
            <div key={index} className="mb-3">
              <h4>{address.type}</h4>
              <p>{address.line1}</p>
              <p>{address.line2}</p>
              <p>{address.city}, {address.stateCode} {address.postalCode}</p>
            </div>
          ))}

          <div>
            <p className="mb-2 font-bold">Directions:</p>
            <p>{park.directionsInfo}</p>
          </div>
        </div>

      </div>

    </>
  )
}