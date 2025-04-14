import React, { useState ,useEffect } from 'react';
import PercentageBar from './PercentageBar';


async function fetchData() {
  try {
    const response = await fetch("http://127.0.0.1:5000/SessionTimelineAnalysis/TalkingTime");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(data)
    if (!("AI" in data) && !("Silence" in data) && !("Therapist" in data) && !("Client" in data) && !("Conversation" in data))
      console.error("the inputed values are missing:", error);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

function TalkingTimeUI() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function getData() {
      const fetchedData = await fetchData();
      setData(fetchedData);
    }

    getData(); // Call the fetch function once when the component mounts
  }, []); // Empty dependency array ensures it runs only once
  if (data == null) {
    return <div>Loading...</div>; // Display loading message if data is still null
  }

  var client_percentage = (data["Client"]/data["Conversation"])*100
  var therapist_percentage = (data["Therapist"]/data["Conversation"])*100
  var silence_percentage = (data["Silence"]/data["Conversation"])*100
          return (
            // <div className="justify-between items-center bg-white rounded-lg p-4 border-gray-300 shadow-md w-full" >
            <div className="justify-between items-center">

                  <h2 className="text-black text-lg	 font-semibold p-1">Talking Time</h2>

                  <div className="flex justify-between items-center p-1">
                  <span className="text-black text-sm font-medium">Client</span>
                  <span className="text-black text-sm font-medium">{Math.floor(client_percentage)}%</span>
                  </div>

                  {/* <div className="w-64 bg-gray-200 rounded-full h-2.5  mb-2 w-300">
                  <div className="bg-linear-65 from-purple-500 to-pink-500 h-2.5  rounded-full" style={{ width: `${client_percentage}%` }}></div>
                  </div> */}

                  <PercentageBar value={client_percentage} startColor="purple-500" endColor="pink-500"/>

                  <div className="flex justify-between items-center p-1">
                  <span className="text-black text-sm font-medium">Therapist</span>
                  <span className="text-black text-sm font-medium">{Math.floor(therapist_percentage)}%</span>
                  </div>

                  {/* <div className="w-64 bg-gray-200 rounded-full h-2.5  mb-2 w-300">
                  <div className="bg-linear-65 from-green-500 to-blue-500 h-2.5 rounded-full"  style={{ width: `${therapist_percentage}%` }}></div>
                  </div> */}

                  <PercentageBar value={therapist_percentage} startColor="green-500" endColor="blue-500"/>

                  <div className="flex justify-between items-center p-1 ">
                  <span className="text-black text-sm font-medium ">Silence</span>
                  <span className="text-black text-sm font-medium ">{Math.floor(silence_percentage)}%</span>
                  </div>

                  {/* <div className="w-64 bg-gray-200 rounded-full h-2.5  mb-4 w-300">
                  <div className="bg-linear-65 from-gray-400 to-gray-700 h-2.5 rounded-full "  style={{ width: `${silence_percentage}%` ,padding: "20"}}></div>
                  </div> */}

                  <PercentageBar value={silence_percentage} startColor="gray-400" endColor="gray-700"/>

              </div>

            );
}

export default TalkingTimeUI;
