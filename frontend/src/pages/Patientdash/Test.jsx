import { useState,useEffect } from "react";


export const Test = () => {
    const [zoneTriggered, setZoneTriggered] = useState(0);
  
    const handleZone = () => {
      console.log("Clicked Zone");
      setZoneTriggered(1);
    };
  
    useEffect(() => {
      console.log("useEffect: zoneTriggered is", zoneTriggered);
    }, [zoneTriggered]);
  
    return (
      <div>
        <button onClick={handleZone}>Trigger Zone</button>
        <p>zoneTriggered = {zoneTriggered}</p>
      </div>
    );
  };
  
