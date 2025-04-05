import { aiModels } from "../../data/AIModel/aiModels";

export const PersonaSelector = ({ selectedId, onSelect, mobile }) => {
  const selectedPersona = aiModels.find((p) => p.id === selectedId);

  return (
    <div className={`${mobile ? "flex flex-col" : "space-y-4"}`}>
      {/* Scrollable Persona List */}
      <div
        className={`${
          mobile ? "flex space-x-4 overflow-x-auto p-2" : "space-y-4 p-4"
        }`}
      >
        {aiModels.map((persona) => (
          <button
            key={persona.id}
            onClick={() => onSelect(persona.id)}
            className={`flex items-center space-x-3 ${
              mobile ? "flex-shrink-0 p-3" : "w-full p-3"
            } rounded-xl transition-all ${
              selectedId === persona.id
                ? "border-2 border-blue-500 bg-blue-100"
                : "border-2 border-transparent bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <img
              src={persona.avatar}
              alt={persona.name}
              className="h-12 w-12 rounded-full object-cover md:h-10 md:w-10"
            />
            {!mobile && (
              <div className="text-left">
                <p className="font-medium text-gray-800">{persona.name}</p>
                <p className="text-sm text-gray-500">{persona.role}</p>
                <p className="mt-1 text-xs text-gray-600">
                  {persona.description}
                </p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Mobile-only Description */}
      {mobile && selectedPersona && (
        <div className="border-t border-gray-200 p-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-800">
              {selectedPersona.name}
            </p>
            <p className="mt-1 text-xs text-gray-600">
              {selectedPersona.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
