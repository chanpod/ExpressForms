import { Address, Application, Vehicle } from "@prisma/client";
import { addYears, isValid } from "date-fns";
import { reduce } from "lodash";

import { ApplicationActionErrors } from "~/components/ApplicationsForm";
import { ApplicationData, ApplicationForm } from "~/types/Application";

export class ApplicationValidationService {
  validateApplicationForm(
    application: ApplicationData
  ): ApplicationActionErrors | null {
    let errors: ApplicationActionErrors = {};

    errors.name = this.validateName(application.name);
    errors.firstName = this.validateName(application.firstName);
    errors.lastName = this.validateName(application.lastName);
    errors.dob = this.validateDob(application.dob);
    errors.address = this.validateAddress(application.address);
    errors.vehicles = this.validateVehicles(application.vehicles);

    return this.checkForErrors(errors) ? errors : null;
  }

  checkForErrors(errors?: Record<string, unknown>) {
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

  private validateDob(dob: string) {
    const dobDate = new Date(dob);
    isValid(dobDate);

    console.log("DOB", dobDate.toISOString());
  }

  private validateStreet(street?: string | null) {
    let error = undefined;
    if (!street) {
      error = "Required";
    } else if (street.length < 3) {
      error = "Must be at least 3 characters";
    } else if (street.length > 30) {
      error = "Must be less than 30 characters";
    } else if (!street.match(/^[a-zA-Z0-9 ]+$/)) {
      error = "Must be alphanumeric";
    }

    return error;
  }

  private validateCity(city?: string | null) {
    let error = undefined;
    if (!city) {
      error = "Required";
    } else if (city.length < 3) {
      error = "Must be at least 3 characters";
    } else if (city.length > 30) {
      error = "Must be less than 30 characters";
    } else if (!city.match(/^[a-zA-Z ]+$/)) {
      error = "Shouldn't contain numbers or special characters";
    }

    return error;
  }
  private validateState(state?: string | null) {
    let error = undefined;
    if (!state) {
      error = "Required";
    } else if (state.length !== 2) {
      error = "Must be 2 characters";
    } else if (!state.match(/^[a-zA-Z]+$/)) {
      error = "Must be alphabetic";
    }

    return error;
  }

  private validateAddress(address?: Address | null) {
    let error: Partial<Address> = {};

    error.street = this.validateStreet(address?.street);
    error.city = this.validateCity(address?.city);
    error.state = this.validateState(address?.state);
    error.zip = this.validateZip(address?.zip);

    return this.checkForErrors(error) ? (error as Address) : undefined;
  }

  private validateZip(zip?: string | null) {
    let error = undefined;
    if (!zip) {
      error = "Required";
    } else if (zip.length !== 5) {
      error = "Must be 5 digits";
    } else if (!zip.match(/^[0-9]+$/)) {
      error = "Must be numeric";
    }

    return error;
  }

  private validateVehicles(vehicles?: Vehicle[] | null) {
    let error = [] as Partial<Vehicle>[];

    reduce(
      vehicles,
      (errors, vehicle) => {
        let vehicleError = {} as Partial<Vehicle>;
        vehicleError.make = this.validateName(vehicle.make);
        vehicleError.model = this.validateName(vehicle.model);
        vehicleError.year = this.validateYear(vehicle.year);
        vehicleError.vin = this.validateVin(vehicle.vin);

        if (this.checkForErrors(vehicleError)) {
          return errors?.push(vehicleError);
        }

        return errors;
      },
      error
    );
    return error;
  }

  private validateVin(vin?: string | null) {
    var vinPattern = /^[A-HJ-NPR-Z0-9]{17}$/;
    return vinPattern.test(vin) ? undefined : "Invalid VIN";
  }

  private validateYear(year?: number | null) {
    let error = undefined;
    let maxYearDate = addYears(new Date(), 2).getFullYear();
    if (!year) {
      error = "Required";
    } else if (year < 1900) {
      error = "Must be at least 1900";
    } else if (year > maxYearDate) {
      error = `Must be less than ${maxYearDate}`;
    }

    return error;
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

  completedApplication(application: Partial<ApplicationForm>) {
    let completed = false;

    if (application.name && application.firstName && application.lastName) {
      completed = true;
    }
  }
}
