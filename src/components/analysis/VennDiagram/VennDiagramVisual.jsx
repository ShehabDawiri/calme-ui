import React, { useState ,useEffect } from 'react';
import data from './dataInput2.json';
import VennDiagramOneCircle from './VennDiagramOneCircle';

export default function VennDiagramVisual() {
    const items = Array.from({ length: 6 }, (_, i) => i);
    const colorScheme = ["gray","red","yellow","blue","green","pink"];
    console.log("Colors CODE IN ME",Object.keys(data).length)


    return (
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(20rem,_1fr))]">
            {items.map((i) => (
        <VennDiagramOneCircle oneDiagramData={data[i]} colorScheme={colorScheme[i]} ItemCounterColor={`${colorScheme[(i+1)%6]}-100`} />
      ))}
            {/* <VennDiagramOneCircle oneDiagramData={data[0]} colorScheme={"gray"} />
            <VennDiagramOneCircle oneDiagramData={data[1]} colorScheme={"red"} />
            <VennDiagramOneCircle oneDiagramData={data[2]} colorScheme={"yellow"} />
            <VennDiagramOneCircle oneDiagramData={data[3]} colorScheme={"blue"} />
            <VennDiagramOneCircle oneDiagramData={data[4]} colorScheme={"green"} /> */}
        </div>
    );
}