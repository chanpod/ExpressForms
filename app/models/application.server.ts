import { Prisma, Vehicle } from "@prisma/client";
import { filter, map } from "lodash";
import { prisma } from "~/db.server";
import { ApplicationData, RemoveVehicle } from "~/types/Application";
import { v4 as uuidv4 } from "uuid";

export function getApplications() {
  return prisma.application.findMany({
    select: { id: true, name: true, completed: true },
    orderBy: { createdAt: "desc" },
  });
}

export function getApplicationsRawSql() {
  return prisma.$queryRaw(Prisma.sql`SELECT * FROM Application`);
}

export async function createApplication(application: ApplicationData) {
  const applicationId = uuidv4();
  const result: any =
    await prisma.$queryRaw(Prisma.sql`INSERT INTO Application (id, name, firstName, lastName, dob, completed) 
    VALUES (${applicationId} ${application.name}, ${application.firstName}, ${application.lastName}, ${application.dob}, ${application.completed})`);
  console.log(result);

  const addressId = uuidv4();
  const result2: any =
    await prisma.$queryRaw(Prisma.sql`INSERT INTO Address (id, street, city, state, zip, applicationId)
    VALUES (${addressId}, ${application.address.street}, ${application.address.city}, ${application.address.state}, ${application.address.zip}, ${applicationId})`);

  console.log(result2);

  const vehicles = application.vehicles as Vehicle[];
  const vehiclesToInsert = vehicles.map((vehicle) => {
    return Prisma.sql`(${uuidv4()}, ${vehicle.make}, ${vehicle.model}, ${
      vehicle.year
    }, ${vehicle.vin}, ${applicationId})`;
  });

  const result3: any =
    await prisma.$queryRaw(Prisma.sql`INSERT INTO Vehicle (id, make, model, year, vin, applicationId)
    VALUES ${Prisma.join(vehiclesToInsert, Prisma.sql`, `)}`);

  console.log(result3);

  return result;

  // return prisma.application.create({
  //   data: {
  //     name: application.name,
  //     firstName: application.firstName,
  //     lastName: application.lastName,
  //     dob: application.dob,
  //     completed: application.completed,
  //     address: {
  //       create: {
  //         street: application.address.street,
  //         city: application.address.city,
  //         state: application.address.state,
  //         zip: application.address.zip,
  //       },
  //     },
  //     vehicles: {
  //       create: application.vehicles as Vehicle[],
  //     },
  //   },
  // });
}

export function updateApplication({
  applicationId,
  application,
}: {
  applicationId: string;
  application: ApplicationData;
}) {
  const vehiclesToUpdate = filter(
    application.vehicles as Vehicle[],
    (vehicle: Vehicle) => {
      return vehicle.id && (vehicle as RemoveVehicle).remove !== true;
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
