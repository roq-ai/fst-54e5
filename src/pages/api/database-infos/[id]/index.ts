import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { databaseInfoValidationSchema } from 'validationSchema/database-infos';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.database_info
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getDatabaseInfoById();
    case 'PUT':
      return updateDatabaseInfoById();
    case 'DELETE':
      return deleteDatabaseInfoById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getDatabaseInfoById() {
    const data = await prisma.database_info.findFirst(convertQueryToPrismaUtil(req.query, 'database_info'));
    return res.status(200).json(data);
  }

  async function updateDatabaseInfoById() {
    await databaseInfoValidationSchema.validate(req.body);
    const data = await prisma.database_info.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteDatabaseInfoById() {
    const data = await prisma.database_info.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
