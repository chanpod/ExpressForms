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
  removeVehicle?: (vehicle: Partial<Vehicle>) => void;
}

export const VehicleForm = ({
  vehicle,
  errors,
  addVehicle,
  updateVehicle,
  removeVehicle,
}: Props) => {
  const makeRef = useRef<HTMLTextAreaElement>(null);
  const modelRef = useRef<HTMLTextAreaElement>(null);
  const yearRef = useRef<HTMLTextAreaElement>(null);
  const vinRef = useRef<HTMLTextAreaElement>(null);

  const editingVehicle = vehicle !== undefined;

  const hasErrors = find(
    errors?.vehicles,
    (vehicleError) =>
      vehicleError.id === vehicle?.id || vehicleError.vin === vehicle?.vin
  );

  function updateParentVehicle() {
    const newVehicle: Partial<Vehicle> = {
      make: makeRef.current?.value!,
      model: modelRef.current?.value!,
      year: parseInt(yearRef.current?.value!),
      vin: vinRef.current?.value!,
      id: vehicle?.id,
      applicationId: vehicle?.applicationId,
    };

    if (updateVehicle) {
      updateVehicle(newVehicle);
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

  function removeVehicleFromParent() {
    if (removeVehicle && vehicle) {
      removeVehicle(vehicle);
    }
  }

  return (
    <div className="max-w-sm overflow-hidden rounded shadow-xl">
      <div className="px-6 py-4">
        <div className="mb-2 text-xl font-bold">
          {editingVehicle ? "Update Vehicle" : "Add A Vehicle"}
        </div>
        <p className="space-y-1 text-base text-gray-700">
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
            onChange={updateParentVehicle}
          />
          <Input
            label="Year"
            name="year"
            ref={yearRef}
            defaultValue={vehicle?.year}
            errors={hasErrors?.year !== undefined}
            errorMessage={hasErrors?.year?.toString() as string}
            onChange={updateParentVehicle}
          />
          <Input
            label="VIN"
            name="vin"
            ref={vinRef}
            defaultValue={vehicle?.vin}
            errors={hasErrors?.vin !== undefined}
            errorMessage={hasErrors?.vin!}
            onChange={updateParentVehicle}
          />
        </p>

        {editingVehicle && (
          <div className="mt-3">
            <button
              type="button"
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
              onClick={removeVehicleFromParent}
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
