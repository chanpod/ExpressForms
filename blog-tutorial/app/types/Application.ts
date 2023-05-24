import { Address, Application } from "@prisma/client";

export interface ApplicationForm extends Application {
  address: Address;
}
