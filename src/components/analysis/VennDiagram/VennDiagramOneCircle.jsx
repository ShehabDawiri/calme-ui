import { VennDiagram, VennLabel, VennSeries, VennArc, Gradient, VennOuterLabel, TooltipArea, TooltipTemplate} from 'reaviz';
function VennDiagramOneCircle({oneDiagramData,colorScheme,ItemCounterColor='blue-100',ItemCounterTextColor='purple-800'}) {
  console.log(oneDiagramData);
  const oneDiagramDataArr = oneDiagramData["data"].map((val) => { return { key: (val["label"].split('&')).map(str => String(str).trim()), data: val["value"] }; });

  console.log("oneDiagramDataArr",oneDiagramDataArr);
  const allLabels = oneDiagramDataArr.flatMap(d => d.key);
  const uniqueLabels = new Set(allLabels);
  console.log("uniqueLabels",uniqueLabels);
  const numberOfCircles = uniqueLabels.size;

  console.log("about to return Circle")
  return (
    <div className="m-2 w-80 justify-between items-center bg-white rounded-lg p-4 border-2 border-gray-200 shadow-md" >
      <div className="flex items-center">
        <h1 className="font-semibold">{oneDiagramData["title"]}</h1>
        <div className={`text-${ItemCounterTextColor} bg-${ItemCounterColor} text-xs font-bold px-2 py-0.5 rounded-full w-fit mx-2 text-center`}>
          {numberOfCircles} items
        </div>
      </div>
      <VennDiagram
        height={300}
        width={300}
        data={oneDiagramDataArr}
        
        series={<VennSeries colorScheme={colorScheme}   gradient={<Gradient />}  label={<VennLabel fill={'#000'} />} outerLabel={<VennOuterLabel fill={'#000'} />} />} />
    </div>
  );
}

export default VennDiagramOneCircle;