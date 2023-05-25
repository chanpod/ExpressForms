import { Address, Application, Vehicle } from "@prisma/client";

//Prisma requires id, so new form objects without an id will fuss about missing and id.
export interface ApplicationData
  extends Pick<
    Application,
    "name" | "firstName" | "lastName" | "dob" | "completed"
  > {
  id?: string;
  address: Address;
  vehicles: Vehicle[];
}

export interface ApplicationActionErrors {
  name?: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
  vehicles?: Vehicle[];
  address?: Address;
}

export interface ApplicationForm
  extends Pick<
    Application,
    "name" | "firstName" | "lastName" | "dob" | "completed"
  > {
  city: string;
  state: string;
  street: string;
  zip: string;
  vehicles: string | Vehicle[];
}

export interface RemoveVehicle extends Vehicle {
  remove: boolean;
}
