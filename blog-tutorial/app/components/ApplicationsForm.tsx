import { Address, Application, Vehicle } from "@prisma/client";
import { Form, useFetcher, useSubmit } from "@remix-run/react";
import { forwardRef, useEffect, useRef, useState } from "react";
import Input from "~/components/Input";
import { ApplicationForm, RemoveVehicle } from "~/types/Application";
import { VehicleForm } from "./VehicleForm";
import { filter, findIndex, map, replace } from "lodash";
import PersonForm from "./PersonForm";

export interface ApplicationActionErrors {
  name?: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
  vehicles?: Vehicle[];
  address?: Address;
}

interface Props {
  errors?: ApplicationActionErrors;
  application?: ApplicationForm;
}

export const ApplicationsForm = ({ application, errors }: Props) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLTextAreaElement>(null);
  const stateRef = useRef<HTMLTextAreaElement>(null);
  const zipRef = useRef<HTMLTextAreaElement>(null);
  const streetRef = useRef<HTMLTextAreaElement>(null);

  const [vehicles, setVehicles] = useState<Partial<Vehicle>[]>(
    application?.vehicles ?? []
  );

  useEffect(() => {
    if (errors?.name) {
      nameRef.current?.focus();
    } else if (errors?.address?.city) {
      cityRef.current?.focus();
    } else if (errors?.address?.state) {
      stateRef.current?.focus();
    } else if (errors?.address?.zip) {
      zipRef.current?.focus();
    } else if (errors?.address?.street) {
      streetRef.current?.focus();
    }
  }, [errors]);

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
        (v) => v.id === vehicle.id || v.vin === vehicle.vin
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

  function updateVehicle(vehicle: Partial<Vehicle>) {
    const index = findIndex(vehicles, (v) => v.id === vehicle.id);
    const newVehicles = [...vehicles];
    newVehicles[index] = vehicle;
    setVehicles(newVehicles);
  }

  return (
    <>
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

      <div className="flex flex-row space-x-3">
        <Input
          label="City"
          ref={cityRef}
          name="city"
          errors={errors?.address?.city !== undefined}
          errorMessage={errors?.address?.city}
          defaultValue={application?.address?.city}
        />

        <Input
          label="State"
          ref={stateRef}
          name="state"
          errors={errors?.address?.state !== undefined}
          errorMessage={errors?.address?.state}
          defaultValue={application?.address?.state}
        />

        <Input
          label="Zip"
          ref={zipRef}
          name="zip"
          errors={errors?.address?.zip !== undefined}
          errorMessage={errors?.address?.zip}
          defaultValue={application?.address?.zip}
        />

        <Input
          label="Street"
          ref={streetRef}
          name="street"
          errors={errors?.address?.street !== undefined}
          errorMessage={errors?.address?.street}
          defaultValue={application?.address?.street}
        />
      </div>

      <div className="flex flex-row space-x-3">
        {map(
          filter(vehicles, (vehicle: RemoveVehicle) => vehicle.remove !== true),
          (vehicle, index) => (
            <VehicleForm
              key={index}
              vehicle={vehicle as Vehicle}
              addVehicle={addVehicle}
              updateVehicle={updateVehicle}
              removeVehicle={markVehicleForRemoval}
            />
          )
        )}

        <input name="vehicles" type="hidden" value={JSON.stringify(vehicles)} />
      </div>

      <VehicleForm addVehicle={addVehicle} />
    </>
  );
};
