import { Vehicle } from "@prisma/client";
import { filter, map } from "lodash";
import { v } from "vitest/dist/types-e3c9754d";
import { prisma } from "~/db.server";
import { ApplicationData, ApplicationForm, RemoveVehicle } from "~/types/Application";

export function getApplications() {
  return prisma.application.findMany({
    select: { id: true, name: true, completed: true },
    orderBy: { createdAt: "desc" },
  });
}

export function createApplication(application: ApplicationData) {
  return prisma.application.create({
    data: {
      name: application.name,
      firstName: application.firstName,
      lastName: application.lastName,
      dob: application.dob,
      completed: application.completed,
      address: {
        create: {
          street: application.address.street,
          city: application.address.city,
          state: application.address.state,
          zip: application.address.zip,
        },
      },
      vehicles: {
        create: application.vehicles as Vehicle[],
      },
    },
  });
}

export function updateApplication({
  applicationId,
  application,
}: {
  applicationId: string;
  application: ApplicationForm;
}) {
  const vehiclesToUpdate = filter(
    application.vehicles as Vehicle[],
    (vehicle: Vehicle) => {
      return vehicle.id && vehicle.remove !== true;
    }
  );
  const vehiclesToCreate = filter(
    application.vehicles as Vehicle[],
    (vehicle: Vehicle) => {
      return !vehicle.id;
    }
  );
  const vehiclesToRemove = filter(
    application.vehicles as RemoveVehicle[],
    (vehicle) => {
      return vehicle.remove;
    }
  );
  return prisma.application.update({
    where: { id: applicationId },
    data: {
      name: application.name,
      firstName: application.firstName,
      lastName: application.lastName,
      dob: application.dob,
      completed: application.completed,
      address: {
        update: {
          street: application.address.street,
          city: application.address.city,
          state: application.address.state,
          zip: application.address.zip,
        },
      },
      vehicles: {
        update: map(vehiclesToUpdate as Vehicle[], (vehicle: Vehicle) => {
          return {
            where: { id: vehicle.id },
            data: {
              make: vehicle.make,
              model: vehicle.model,
              year: vehicle.year,
              vin: vehicle.vin,
            },
          };
        }),
        create: vehiclesToCreate ? (vehiclesToCreate as Vehicle[]) : undefined,
        delete: map(vehiclesToRemove, (vehicle) => {
          return { id: vehicle.id };
        }),
      },
    },
  });
}

export function getApplication({ applicationId }: { applicationId: string }) {
  return prisma.application.findUnique({
    where: { id: applicationId },
    include: { address: true, vehicles: true },
  });
}

export function deleteApplication({
  applicationId,
}: {
  applicationId: string;
}) {
  return prisma.application.delete({
    where: { id: applicationId },
  });
}
