import AnalysisMain from './SessionTimelineAnalysisDashboardFolder/AnalysisMain.jsx'
import SessionTimeline from './SessionTimelineVisualization/timeline.jsx'
import TopWords from './Top10Words/TopWords.jsx';
import VennDiagramVisual from './VennDiagram/VennDiagramVisual.jsx';

function Team1Main() {
          return (
            <div>
              <div className="m-1 justify-between items-center bg-white rounded-lg p-4 border-2 border-gray-200 shadow-md w-full" >
              <SessionTimeline />
              </div>
              <div className="m-1">
              <AnalysisMain />
              </div>
              <div className="m-1">
              <TopWords />
              </div>
              <div>
              <VennDiagramVisual />  
              </div>
            </div>
            );
}

export default Team1Main;
