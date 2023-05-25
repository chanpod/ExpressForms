import { Vehicle } from "@prisma/client";
import { filter, find, findIndex, map } from "lodash";
import { useEffect, useRef, useState } from "react";
import Input from "~/components/Input";
import {
  ApplicationActionErrors,
  ApplicationData,
  RemoveVehicle,
} from "~/types/Application";
import AddressForm from "./AddressForm";
import PersonForm from "./PersonForm";
import { VehicleForm } from "./VehicleForm";

interface Props {
  errors?: ApplicationActionErrors;
  application?: ApplicationData;
}

export const ApplicationsForm = ({ application, errors }: Props) => {
  const nameRef = useRef<HTMLInputElement>(null);

  const [vehicles, setVehicles] = useState<Partial<Vehicle>[]>(
    application?.vehicles ?? []
  );

  useEffect(() => {
    if (errors?.name) {
      nameRef.current?.focus();
    }
  }, [errors]);

  useEffect(() => {
    //We want to update the new vehicles if saved properly so they have a proper ID. But if there's vehicle errors we want to skip this step or we'll lose the new vehicles
    if (application?.vehicles && errors?.vehicles?.length === 0) {
      setVehicles(application?.vehicles ?? []);
    }
  }, [application?.vehicles]);

  function addVehicle(vehicle: Partial<Vehicle>) {
    if (vehicles.length < 3) {
      setVehicles([...vehicles, vehicle]);
    } else {
      alert("Can't have more than three vehicles");
    }
  }

  function markVehicleForRemoval(vehicle: Partial<RemoveVehicle>) {
    let index;
    //vehicle already exists in the database
    if (vehicle.id) {
      index = findIndex(
        vehicles,
        (v) => v.id === vehicle.id || v.id === vehicle.id
      );
      const newVehicles = [...vehicles];
      vehicle.remove = true;
      newVehicles[index] = vehicle;
      setVehicles(newVehicles);
    } else {
      //vehicle is new
      index = findIndex(vehicles, (v) => v.vin === vehicle.vin);
      const newVehicles = [...vehicles];
      newVehicles.splice(index, 1);
      setVehicles(newVehicles);
    }
  }

  function updateVehicle(
    vehicle: Partial<Vehicle>,
    newVehiclePosition: number
  ) {
    let newVehicles = [...vehicles];

    newVehicles.splice(newVehiclePosition, 1);
    const duplicateVin = find(
      newVehicles,
      (iVehicle) => iVehicle.vin === vehicle.vin && vehicle.vin !== ""
    );

    if (duplicateVin) {
      alert("Can't have duplicate VINs");
    } else {
      newVehicles = [...vehicles];
      newVehicles[newVehiclePosition] = vehicle;

      setVehicles(newVehicles);
    }
  }

  return (
    <>
      <h2 className="text-2xl">Personal Information</h2>
      <div>
        <Input
          label="Name"
          ref={nameRef}
          name="name"
          errors={errors?.name !== undefined}
          errorMessage={errors?.name as string}
          defaultValue={application?.name}
        />
      </div>

      <div>
        <PersonForm errors={errors} application={application} />
      </div>
      <div>
        <AddressForm errors={errors} application={application} />
      </div>

      <hr />
      <div>
        <div className="flex flex-row space-x-3">
          <h2 className="text-2xl">Vehicles</h2>
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
            type="button"
            onClick={() => addVehicle({})}
          >
            + Add Vehicle
          </button>
        </div>
        <div className="flex flex-row space-x-3">
          {map(
            filter(
              vehicles,
              (vehicle: RemoveVehicle) => vehicle.remove !== true
            ),
            (vehicle, index) => (
              <VehicleForm
                key={index}
                position={index}
                vehicle={vehicle as Vehicle}
                updateVehicle={updateVehicle}
                removeVehicle={markVehicleForRemoval}
                errors={errors}
              />
            )
          )}

          <input
            name="vehicles"
            type="hidden"
            value={JSON.stringify(vehicles)}
          />
        </div>
      </div>
    </>
  );
};
