import { Address, Vehicle } from "@prisma/client";

import { ApplicationData, ApplicationForm } from "~/types/Application";
import { ApplicationValidationService } from "./ApplicationValidation.service";

export class ApplicationFormService {
  buildFormData(formData: FormData) {
    return {
      name: formData.get("name") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      dob: formData.get("dob") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      zip: formData.get("zip") as string,
      street: formData.get("street") as string,
      vehicles: formData.get("vehicles") as string,
    } as ApplicationForm;
  }

  extractFormData(formData: FormData) {
    const vehicles: Vehicle[] = JSON.parse(formData.get("vehicles") as string);
    const applicationValidation = new ApplicationValidationService();

    const application: ApplicationData = {
      name: formData.get("name") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      dob: formData.get("dob") as string,
      completed: false,
      address: {
        street: formData.get("street") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        zip: formData.get("zip") as string,
      } as Address,
      vehicles: vehicles ? vehicles : [],
    };

    application.completed =
      applicationValidation.completedApplication(application);

    return application;
  }
}
