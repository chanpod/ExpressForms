import React from "react";

const VehicleCard = ({ children }: any) => {
  return (
    <div className="max-w-sm overflow-hidden rounded shadow-xl p-4">
      <div className="mb-2 text-xl font-bold">Vehicle</div>
      <p className="space-y-1 text-base text-gray-700">{children}</p>
    </div>
  );
};

export default VehicleCard;
