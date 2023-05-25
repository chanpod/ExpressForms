import { Address, Application, Vehicle } from "@prisma/client";

export interface ApplicationForm extends Application {
  city: string;
  state: string;
  street: string;
  zip: string;
  vehicles: string | Vehicle[];
}
