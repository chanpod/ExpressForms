import { prisma } from "~/db.server";
import { ApplicationForm } from "~/types/Application";

export function getApplications() {
  return prisma.application.findMany({
    select: { id: true, name: true, completed: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createApplication(application: Partial<ApplicationForm>) {
  return prisma.application.create({ data: application as ApplicationForm });
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
