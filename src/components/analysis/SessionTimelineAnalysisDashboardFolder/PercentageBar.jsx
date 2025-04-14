import React from 'react';

function PercentageBar({value,startColor,endColor}) {

    return (
        <div className=" bg-gray-200 rounded-full h-2.5  mb-2 w-full">
        <div className={`bg-linear-65 from-${startColor} to-${endColor} h-2.5 rounded-full`}  style={{ width: `${value}%` }}>
        </div>
        </div>
    )
}
export default PercentageBar;