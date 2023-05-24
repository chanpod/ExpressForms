import { Application } from "@prisma/client";

import { ApplicationActionErrors } from "~/components/ApplicationsForm";
import { ApplicationForm } from "~/types/Application";


export class ApplicationsService {
  validateApplicationForm(
    application: Partial<ApplicationForm>
  ): ApplicationActionErrors | null {
    let errors: ApplicationActionErrors = {};

    errors.name = this.validateName(application.name);
    errors.firstName = this.validateName(application.firstName);
    errors.lastName = this.validateName(application.lastName);

    return this.checkForErrors(errors) ? errors : null;
  }

  checkForErrors(errors?: ApplicationActionErrors) {
    let hasErrors = false;
    if (errors) {
      Object.keys(errors).forEach((key) => {
        if (errors[key] !== undefined) {
          hasErrors = true;
        }
      });
    }
    return hasErrors;
  }

  private validateName(name?: string | null) {
    let error = undefined;
    if (!name) {
      error = "Required";
    } else if (name.length < 3) {
      error = "Must be at least 3 characters";
    } else if (name.length > 30) {
      error = "Must be less than 30 characters";
    } else if (!name.match(/^[a-zA-Z0-9 ]+$/)) {
      error = "Must be alphanumeric";
    }

    return error;
  }

  async extractFormData(request: Request) {
    const formData = await request.formData();

    const application: Partial<ApplicationForm> = {
      name: formData.get("name") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
    };

    return application;
  }
}
