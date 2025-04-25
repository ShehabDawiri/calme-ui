import data from './dataInput.json';
import VennDiagramOneCircle from './VennDiagramOneCircle';

export default function VennDiagramVisual()
{
    return(
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(20rem,_1fr))]">
        {data.map((val, index) => {
      // Define color schemes for first 4 items
      const colorSchemes = ["gray", "red", "yellow", "blue"];
      const scheme = colorSchemes[index] || "gray"; // Fallback to gray
      console.log("value  ",index,val);
      return (
        <div key={val.category} className="p-4">
          <VennDiagramOneCircle 
            oneDiagramData={val} 
            colorScheme={scheme}
          />
        </div>
      );
    })}
        {/* <VennDiagramOneCircle oneDiagramData={data[0]} colorScheme={"gray"}/>
        <VennDiagramOneCircle oneDiagramData={data[1]} colorScheme={"red"}/>
        <VennDiagramOneCircle oneDiagramData={data[2]} colorScheme={"yellow"}/>
        <VennDiagramOneCircle oneDiagramData={data[3]} colorScheme={"blue"}/> */}
    </div>
    );
}