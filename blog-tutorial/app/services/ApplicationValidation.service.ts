import { Address, Application, Vehicle } from "@prisma/client";
import { addYears, isBefore, isValid, subYears } from "date-fns";
import { forEach, reduce, subtract } from "lodash";

import {
  ApplicationActionErrors,
  ApplicationData,
  ApplicationForm,
  RemoveVehicle,
} from "~/types/Application";

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

  validateApplication(
    application: ApplicationData
  ): ApplicationActionErrors | null {
    let errors: ApplicationActionErrors = {};

    errors.name = this.validateName(application.name);
    errors.firstName = this.validateName(application.firstName);
    errors.lastName = this.validateName(application.lastName);
    errors.dob = this.validateDob(application.dob);
    errors.address = this.validateAddress(application.address);
    errors.vehicles = this.validateVehicles(application.vehicles, true);

    return this.checkForErrors(errors) ? errors : null;
  }

  checkForErrors(errors?: Record<string, unknown>) {
    let hasErrors = false;
    if (errors) {
      Object.keys(errors).forEach((key) => {
        if (
          errors[key] !== undefined ||
          (Array.isArray(errors[key]) && (errors[key] as []).length > 0)
        ) {
          hasErrors = true;
        }
      });
    }

    return hasErrors;
  }

  //Must be 18 years old
  private validateDob(dob: string) {
    const dobDate = new Date(dob);
    let valid = isValid(dobDate);

    if (valid) {
      const minDate = subYears(new Date(), 16);
      valid = isBefore(dobDate, minDate);
    }

    return valid ? undefined : "Invalid Date. Must be at least 16 years old";
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

  private validateVehicles(vehicles?: Vehicle[] | null, required = false) {
    let errors = [] as Partial<Vehicle>[];

    forEach(vehicles, (vehicle) => {
      if ((vehicle as RemoveVehicle).remove) return;
      let vehicleError = {} as Partial<Vehicle>;
      vehicleError.make = this.validateName(vehicle.make);
      vehicleError.model = this.validateName(vehicle.model);
      vehicleError.year = this.validateYear(vehicle.year);
      vehicleError.vin = this.validateVin(vehicle.vin);

      if (this.checkForErrors(vehicleError)) {
        //We need to know which vehicle the error belongs to. Could use a map instead of an array
        //new vehicles don't have an ID yet. Could store them in the DB invalid to mitigate this.
        if (vehicle.id) {
          vehicleError.id = vehicle.id;
        } else {
          //b/c we look at vin for the error, we can't use it as the id here. Sketchy design is sketchy
          vehicleError.id = vehicle.vin;
        }
        return errors.push(vehicleError);
      }

      return errors;
    });

    if (!required && errors.length === 0) {
      return undefined;
    }

    if ((required && vehicles?.length === 0) || errors.length > 0) {
      return errors;
    }
  }
  //vin must be 17 long and alphanumeric
  private validateVin(vin?: string | null) {
    let error = undefined;
    if (!vin) {
      error = "Required";
    } else if (vin.length !== 17) {
      error = "Must be 17 characters. Currently " + vin.length;
    } else if (!vin.match(/^[a-zA-Z0-9]+$/)) {
      error = "Must be alphanumeric";
    }

    return error;
  }

  private validateYear(year?: number | null) {
    let error = undefined;
    let maxYearDate = addYears(new Date(), 1).getFullYear();
    if (!year) {
      error = "Required";
    } else if (year < 1985) {
      error = "Must be at least 1985";
    } else if (year > maxYearDate) {
      error = `Must be less than ${maxYearDate + 1}`;
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

  completedApplication(application: ApplicationData) {
    let completed = false;
    const errors = this.validateApplication(application);

    if (errors === null) {
      completed = true;
    }

    return completed;
  }
}
