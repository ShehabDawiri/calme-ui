import AnalysisMain from './SessionTimelineAnalysisDashboardFolder/AnalysisMain.jsx'
import SessionTimeline from './SessionTimelineVisualization/timeline.jsx'
import TopWords from './Top10Words/TopWords.jsx';

function Team1Main() {
          return (
            <div>
              <div className="justify-between items-center bg-white rounded-lg p-4 border-2 border-gray-200 shadow-md w-full" >
              <SessionTimeline />
              </div>
              <AnalysisMain />
              <div>
              <TopWords />
              </div>
            </div>
            );
}

export default Team1Main;
