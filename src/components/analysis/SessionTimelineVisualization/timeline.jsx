import React, { useState ,useEffect } from 'react';
import styles from './timeline.module.css';

async function fetchData() {
  try {
    const response = await fetch("http://127.0.0.1:5000/SessionTimelineVisualization");
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

const SessionTimeline = () => {
  
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


  const { duration, clinicianTalk, memberTalk, topics } = data;

  const calculatePercentage = (time) => (time / duration) * 100;

  const uniqueTopics = [];
  const seenTopics = new Set();
  topics.forEach(topic => {
    if (!seenTopics.has(topic.name)) {
      seenTopics.add(topic.name);
      uniqueTopics.push(topic);
    }
  });

  return (
    <div className={styles["timeline-container"]}>
      <h1>Session Timeline</h1>
      
      <div className={styles["time-axis"]}>
        {[0, 15, 30, 45, 60].map(time => (
          <div key={time} className={styles["time-marker"]}>{time}:00</div>
        ))}
      </div>

      <div className={styles["timeline-row"]}>
        <div className={styles["row-label"]}>Therapist</div>
        <div className={styles["timeline-track"]}>
          {clinicianTalk.map((segment, i) => (
            <div
              key={`c-${i}`}
              className={`${styles['timeline-segment']} ${segment.isSilence ? styles.silence : styles.clinician}`}
              style={{
                left: `${calculatePercentage(segment.start)}%`,
                width: `${calculatePercentage(segment.end - segment.start)}%`
              }}
              title={segment.timeRange || 'Silence'}
            />
          ))}
        </div>
      </div>

      <div className={styles["timeline-row"]}>
        <div className={styles["row-label"]}>Client</div>
        <div className={styles["timeline-track"]}>
          {memberTalk.map((segment, i) => (
            <div
              key={`m-${i}`}
              className={`${styles['timeline-segment']} ${segment.isSilence ? styles.silence : styles.member}`}
              style={{
                left: `${calculatePercentage(segment.start)}%`,
                width: `${calculatePercentage(segment.end - segment.start)}%`
              }}
              title={segment.timeRange || 'Silence'}
            />
          ))}
        </div>
      </div>

      {topics.length > 0 && (
        <>
          <div className={styles["timeline-row"]}>
            <div className={styles["row-label"]}>Topics</div>
            <div className={styles["timeline-track"]}>
              {topics.map((topic, i) => (
                <div
                  key={`t-${i}`}
                  className={`${styles['timeline-segment']} ${styles.topic}`}
                  style={{
                    left: `${calculatePercentage(topic.start)}%`,
                    width: `${calculatePercentage(topic.end - topic.start)}%`,
                    backgroundColor: topic.color
                  }}
                  title={`${topic.name} (${topic.timeRange})`}
                />
              ))}
            </div>
          </div>

          <div className={styles["topics-legend"]}>
            {uniqueTopics.map((topic, i) => (
              <div key={`l-${i}`} className={styles["legend-item"]}>
                <span className={styles["legend-color"]} style={{ backgroundColor: topic.color }} />
                <span className={styles["legend-label"]}>{topic.name}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SessionTimeline;