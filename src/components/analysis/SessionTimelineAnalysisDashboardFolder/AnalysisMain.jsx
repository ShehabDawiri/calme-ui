import React, { useState ,useEffect } from 'react';
import TalkingTimeUI from './TalkingTimeUI';
// import SpeechCadenceUI from './SpeechCadenceUI';
import ClientSentimentUI from './ClientSentimentUI';
import ClientTenseUI from './ClientTenseUI';

function AnalysisMain() {

    return (
        <div className="justify-between items-center bg-white rounded-lg p-4 border-2 border-gray-200 shadow-md w-full" >
            <TalkingTimeUI />
            {/* <SpeechCadenceUI /> */}
            <ClientSentimentUI />
            <ClientTenseUI />
        </div>
    )
}

export default AnalysisMain;
