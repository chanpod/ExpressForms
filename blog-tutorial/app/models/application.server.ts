import { map } from "lodash";
import { v } from "vitest/dist/types-e3c9754d";
import { prisma } from "~/db.server";
import { ApplicationForm } from "~/types/Application";

export function getApplications() {
  return prisma.application.findMany({
    select: { id: true, name: true, completed: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createApplication(application: ApplicationForm) {
  return prisma.application.create({
    data: {
      name: application.name,
      firstName: application.firstName,
      lastName: application.lastName,
      dob: application.dob,
      address: {
        create: {
          street: application.address.street,
          city: application.address.city,
          state: application.address.state,
          zip: application.address.zip,
        },
      },
      vehicles: {
        create: map(application.vehicles, (vehicle: Vehicle) => {
          return {
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            vin: vehicle.vin,
          };
        }),
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
  return prisma.application.update({
    where: { id: applicationId },
    data: {
      name: application.name,
      firstName: application.firstName,
      lastName: application.lastName,
      dob: application.dob,
      address: {
        update: {
          street: application.address.street,
          city: application.address.city,
          state: application.address.state,
          zip: application.address.zip,
        },
      },
      vehicles: {
        updateMany: {
          where: { applicationId },
          data: application.vehicles,
        },
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
