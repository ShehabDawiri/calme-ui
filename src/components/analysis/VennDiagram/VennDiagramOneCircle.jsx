import { VennDiagram, VennLabel, VennSeries, VennArc, Gradient, VennOuterLabel, TooltipArea, TooltipTemplate} from 'reaviz';

// import data from './dataInput.json';

// let oneDiagramData = data[0];

// export default function VennDiagramVisual(oneDiagramData) {

export default function VennDiagramOneCircle({oneDiagramData,colorScheme}) {
  console.log(oneDiagramData)
  let oneDiagramDataArr2 = oneDiagramData["data"].map((val) => { return { key: val["label"].split(' '), data: val["value"] }; });
  let allLabels = oneDiagramDataArr2.flatMap(d => d.key);
  const uniqueLabels = new Set(allLabels);
  const numberOfCircles = uniqueLabels.size;


  console.log("about to return Circle")
  return (
    <div className="m-2 w-80 justify-between items-center bg-white rounded-lg p-4 border-2 border-gray-200 shadow-md" >
      <div className="flex items-center">
        <h1 className="font-semibold">{oneDiagramData["title"]}</h1>
        <div className={`text-purple-800 bg-blue-100 text-xs font-bold px-2 py-0.5 rounded-full w-fit mx-2 text-center`}>
          {numberOfCircles} items
        </div>
      </div>
      <VennDiagram
        height={300}
        width={300}
        data={oneDiagramDataArr2}
        
        series={<VennSeries colorScheme={colorScheme}   gradient={<Gradient />}  label={<VennLabel fill={'#000'} />} outerLabel={<VennOuterLabel fill={'#000'} />} />} />
    </div>
  );
}