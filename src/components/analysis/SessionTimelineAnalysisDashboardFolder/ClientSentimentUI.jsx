import React, { useState ,useEffect } from 'react';
import PercentageBar from './PercentageBar';

async function fetchData() {
  try {
    const response = await fetch("http://127.0.0.1:5000/SessionTimelineAnalysis/ClientSentiment");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(data)
    if (!("positive_counter" in data) && !("neutral_counter" in data) && !("negative_counter" in data) )
      console.error("the inputed values are missing:", error);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

function ClientSentimentUI() {
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
  

  var positive_percentage = data["positive_counter"]*100
  var negative_percentage = data["negative_counter"]*100
  var neutral_percentage = data["neutral_counter"]*100
          return (
            // <div className="justify-between items-center bg-white rounded-lg p-4 border-gray-300 shadow-md w-full" >
            <div className="justify-between items-center">

                  <h2 className="text-black text-lg	 font-semibold p-1">Client Sentiment and Tense</h2>

                  <div className="flex justify-between items-center p-1">
                  <span className="text-black text-sm font-medium">Positive</span>
                  <span className="text-black text-sm font-medium">{Math.floor(positive_percentage)}%</span>
                  </div>

                  {/* <div className=" bg-gray-200 rounded-full h-2.5  mb-2 w-full">
                  <div className="bg-linear-65 from-green-200 to-green-500 h-2.5  rounded-full" style={{ width: `${positive_percentage}%` }}></div>
                  </div> */}

                  <PercentageBar value={positive_percentage} startColor="green-200" endColor="green-500"/>

                  <div className="flex justify-between items-center p-1">
                  <span className="text-black text-sm font-medium">Negative</span>
                  <span className="text-black text-sm font-medium">{Math.floor(negative_percentage)}%</span>
                  </div>

                  {/* <div className="w-64 bg-gray-200 rounded-full h-2.5  mb-2 w-300">
                  <div className="bg-linear-65 from-red-400 to-red-700 h-2.5 rounded-full"  style={{ width: `${negative_percentage}%` }}></div>
                  </div> */}

                  <PercentageBar value={negative_percentage} startColor="red-400" endColor="red-700"/>
                  
                  <div className="flex justify-between items-center p-1 ">
                  <span className="text-black text-sm font-medium ">Neutral</span>
                  <span className="text-black text-sm font-medium ">{Math.floor(neutral_percentage)}%</span>
                  </div>

                  {/* <div className="w-64 bg-gray-200 rounded-full h-2.5  mb-4 w-300">
                  <div className="bg-linear-65 from-blue-200 to-blue-600 h-2.5 rounded-full "  style={{ width: `${neutral_percentage}%` ,padding: "20"}}></div>
                  </div> */}

                  <PercentageBar value={neutral_percentage} startColor="blue-200" endColor="blue-600"/>

              </div>

            );
}

export default ClientSentimentUI;
