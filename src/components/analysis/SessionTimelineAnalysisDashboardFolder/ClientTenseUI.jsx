import React, { useState ,useEffect } from 'react';
import PercentageBar from './PercentageBar';

async function fetchData() {
  try {
    const response = await fetch("http://127.0.0.1:5000/SessionTimelineAnalysis/ClientTense");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(data)
    if (!("Future_Percentage" in data))
      console.error("the inputed values are missing:", error);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}


function ClientTenseUI() {
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

    // var past_percentage = 10
    // var present_percentage = 40
    var future_percentage = data["Future_Percentage"]*100
          return (
            // <div className="justify-between items-center bg-white rounded-lg p-4 border-gray-300 shadow-md w-full" >
            <div className="justify-between items-center">
{/* 
                  <h2 className="text-black text-lg	 font-semibold p-1">Client Tense</h2> */}

                  {/* <div className="flex justify-between items-center p-1">
                  <span className="text-black text-sm font-medium">Past</span>
                  <span className="text-black text-sm font-medium">{Math.floor(past_percentage)}%</span>
                  </div>
                  <div className="w-64 bg-gray-200 rounded-full h-2.5  mb-2 w-300">
                  <div className="bg-linear-65 from-purple-500 to-pink-500 h-2.5  rounded-full" style={{ width: `${past_percentage}%` }}></div>
                  </div>

                  <div className="flex justify-between items-center p-1">
                  <span className="text-black text-sm font-medium">Present</span>
                  <span className="text-black text-sm font-medium">{Math.floor(present_percentage)}%</span>
                  </div>

                  <div className="w-64 bg-gray-200 rounded-full h-2.5  mb-2 w-300">
                  <div className="bg-linear-65 from-green-500 to-blue-500 h-2.5 rounded-full"  style={{ width: `${present_percentage}%` }}></div>
                  </div> */}

                  <div className="flex justify-between items-center p-1 ">
                  <span className="text-black text-sm font-medium ">Future</span>
                  <span className="text-black text-sm font-medium ">{Math.floor(future_percentage)}%</span>
                  </div>

                  {/* <div className="w-64 bg-gray-200 rounded-full h-2.5  mb-4 w-300">
                  <div className="bg-linear-65 from-blue-400 to-purple-800 h-2.5 rounded-full "  style={{ width: `${future_percentage}%` ,padding: "20"}}></div>
                  </div> */}

                  <PercentageBar value={future_percentage} startColor="blue-400" endColor="purple-800"/>

              </div>

            );
}

export default ClientTenseUI;
