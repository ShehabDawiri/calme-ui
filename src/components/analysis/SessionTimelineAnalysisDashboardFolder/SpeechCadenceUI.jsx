import React, { useState ,useEffect } from 'react';
import PercentageBar from './PercentageBar';


async function fetchData() {
  try {
    const response = await fetch("http://127.0.0.1:5000/SessionTimelineAnalysis/SpeechCadence");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(data)
    if (false)
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

  var client_wpm = Math.floor(data["client_wpm"])
  var therapist_wpm = Math.floor(data["therapist_wpm"])
  var max_wpm = 200
          return (
            // <div className="justify-between items-center bg-white rounded-lg p-4 border-gray-300 shadow-md w-full" >
            <div className="justify-between items-center">

                  <h2 className="text-black text-lg	 font-semibold p-1">Speech Cadence</h2>

                  <div className="flex justify-between items-center p-1">
                  <span className="text-black text-sm font-medium">Client</span>
                  <span className="text-black text-sm font-medium">{client_wpm}wpm</span>
                  </div>

                  {/* <div className="w-64 bg-gray-200 rounded-full h-2.5  mb-2 w-300">
                  <div className="bg-linear-65 from-yellow-500 to-red-500 h-2.5  rounded-full" style={{ width: `${Math.floor((client_wpm/max_wpm)*100)}%` }}></div>
                  </div> */}

                  <PercentageBar value={Math.floor((client_wpm/max_wpm)*100)} startColor="yellow-500" endColor="red-500"/>


                  <div className="flex justify-between items-center p-1">
                  <span className="text-black text-sm font-medium">Therapist</span>
                  <span className="text-black text-sm font-medium">{therapist_wpm}wpm</span>
                  </div>

                  {/* <div className="w-64 bg-gray-200 rounded-full h-2.5  mb-2 w-300">
                  <div className="bg-linear-65 from-blue-300 to-purple-700 h-2.5 rounded-full"  style={{ width: `${Math.floor((therapist_wpm/max_wpm)*100)}%` }}></div>
                  </div> */}

                  <PercentageBar value={Math.floor((therapist_wpm/max_wpm)*100)} startColor="blue-300" endColor="purple-700"/>

              </div>

            );
}

export default TalkingTimeUI;
