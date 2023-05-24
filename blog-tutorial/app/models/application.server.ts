import { Application } from "@prisma/client";
import { prisma } from "~/db.server";

export function getApplications() {
  return prisma.application.findMany({
    select: { id: true, name: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createApplication(application: Partial<Application>) {
  return prisma.application.create({ data: application as Application });
}

export function getApplication({ applicationId }: { applicationId: string }) {
  return prisma.application.findUnique({
    where: { id: applicationId },
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
