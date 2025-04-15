import { useState } from 'react';

const topWordsData = [
  { word: "Anxiety", freq: 15, speaker: "Client", context: "A common source of stress and anxiety for the client" },
  { word: "Family", freq: 12, speaker: "Client" },
  { word: "Coping", freq: 10, speaker: "Therapist" },
  { word: "Work", freq: 9, speaker: "Client" },
  { word: "Feelings", freq: 8, speaker: "Therapist" },
  { word: "Stress", freq: 7, speaker: "Client" },
  { word: "Relationships", freq: 6, speaker: "Therapist" },
  { word: "Goals", freq: 5, speaker: "Therapist" },
  { word: "Change", freq: 4, speaker: "Client" },
  { word: "Focus", freq: 4, speaker: "Therapist", context: "Used to guide client discussions" },
];

const colors = {
  Client: "bg-red-700",
  Therapist: "bg-blue-500"
};

const colorsBG = [
  '#FDE2E0', // 1
  '#DBEAFE', // 2
  '#DDFCE6', // 3
  '#FFFAD1', // 4
  '#F2E8FF', // 5
  '#FBE7F3', // 6
  '#E0E7FF', // 7
  '#CBFAF1', // 8
  '#FFEDD6', // 9
  '#CEFBFE', // 10
];

const TopWords = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseMove = (e, index) => {
    setMousePosition({ x: e.clientX + 10, y: e.clientY + 10 });
    setHoveredIndex(index);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl  font-bold mb-4 text-gray-800">Top 10 Words</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 place-items-center">
        {topWordsData.map((item, index) => (
          <div
            key={index}
            className="relative text-center p-3 rounded-lg hover:shadow-md transition-all group" 
            style={{ 
              backgroundColor: colorsBG[index],
              width: '170px',  // Fixed width for rectangle shape
              height: '100px', // Fixed height shorter than width
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="font-bold text-gray-900 text-base">{item.word}</div>
            <div className="text-sm text-gray-800">Freq: {item.freq}</div>
            <div className={`${
              item.speaker === "Therapist" ? "text-white bg-blue-600" : "text-black bg-blue-50"
            } text-xs font-bold mt-1 px-3 py-1 rounded-full w-fit mx-auto text-center`}>
              {item.speaker}
            </div>

            

            {item.context && hoveredIndex === index && (
              <div 
                className="fixed z-50 border border-gray-200 bg-white text-gray-900 text-xs rounded-lg p-2 shadow-lg"
                style={{
                  left: `${mousePosition.x}px`,
                  top: `${mousePosition.y}px`,
                  pointerEvents: 'none'
                }}
              >
                <strong>Context:</strong> {item.context}
              </div>
            )}
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopWords;
