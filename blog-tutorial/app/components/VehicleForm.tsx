import React, { useEffect, useRef } from "react";
import Input from "./Input";
import { Vehicle } from "@prisma/client";
import { ApplicationActionErrors } from "./ApplicationsForm";
import { find } from "lodash";
import { error } from "console";

interface Props {
  vehicle?: Vehicle;
  errors?: ApplicationActionErrors;
  addVehicle: (vehicle: Partial<Vehicle>) => void;
  updateVehicle?: (vehicle: Partial<Vehicle>) => void;
}

export const VehicleForm = ({
  vehicle,
  errors,
  addVehicle,
  updateVehicle,
}: Props) => {
  const makeRef = useRef<HTMLTextAreaElement>(null);
  const modelRef = useRef<HTMLTextAreaElement>(null);
  const yearRef = useRef<HTMLTextAreaElement>(null);
  const vinRef = useRef<HTMLTextAreaElement>(null);

  const editingVehicle = vehicle !== undefined;

  const hasErrors = find(
    errors?.vehicles,
    (vehicleError) => vehicleError.vin !== vehicle?.vin
  );

  function updateParentVehicle() {
    console.log("Updating parent with new text values");
    const vehicle: Partial<Vehicle> = {
      make: makeRef.current?.value!,
      model: modelRef.current?.value!,
      year: parseInt(yearRef.current?.value!),
      vin: vinRef.current?.value!,
    };

    if (updateVehicle) {
      updateVehicle(vehicle);
    }
  }

  function addVehicleToParent() {
    const vehicle: Partial<Vehicle> = {
      make: makeRef.current?.value!,
      model: modelRef.current?.value!,
      year: parseInt(yearRef.current?.value!),
      vin: vinRef.current?.value!,
    };
    addVehicle(vehicle);

    makeRef.current.value = "";
    modelRef.current.value = "";
    yearRef.current.value = "";
    vinRef.current.value = "";
  }

  return (
    <div className="max-w-sm overflow-hidden rounded shadow-xl">
      <div className="px-6 py-4">
        <div className="mb-2 text-xl font-bold">
          {editingVehicle ? "Update Vehicle" : "Add A Vehicle"}
        </div>
        <p className="text-base text-gray-700">
          <Input
            label="Make"
            name="make"
            ref={makeRef}
            defaultValue={vehicle?.make}
            errors={hasErrors?.make !== undefined}
            errorMessage={hasErrors?.make!}
            onChange={updateParentVehicle}
          />
          <Input
            label="Model"
            name="model"
            ref={modelRef}
            defaultValue={vehicle?.model}
            errors={hasErrors?.model !== undefined}
            errorMessage={hasErrors?.model!}
          />
          <Input
            label="Year"
            name="year"
            ref={yearRef}
            defaultValue={vehicle?.year}
            errors={hasErrors?.year !== undefined}
            errorMessage={hasErrors?.year?.toString() as string}
          />
          <Input
            label="VIN"
            name="vin"
            ref={vinRef}
            defaultValue={vehicle?.vin}
            errors={hasErrors?.vin !== undefined}
            errorMessage={hasErrors?.vin!}
          />
        </p>
      </div>
      <div className="px-6 pb-2 pt-4">
        {!editingVehicle && (
          <button
            type="button"
            onClick={addVehicleToParent}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Add Vehicle
          </button>
        )}
      </div>
    </div>
  );
};
