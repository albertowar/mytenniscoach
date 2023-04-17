import type { NextApiRequest, NextApiResponse } from 'next';
import { MyTennisCoachRepository } from '@/pages/api/lib/repository';
import {
  toScheduleEvent,
  toScheduleEventDAL
} from '@/pages/api/schedules/convert';
import { getUser, authHandler } from '@/pages/api/lib/auth';
import { ScheduleEventDTO } from '@/lib/types';

const repository = new MyTennisCoachRepository();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  await authHandler(req, res);
  const user = getUser(req.cookies);

  switch (req.method) {
    case 'GET':
      const scheduleDAL = await repository.getSchedules(user);
      const schedule = scheduleDAL.map((e: any) => toScheduleEvent(e));

      return res.status(200).json(schedule);
    case 'POST':
      const event = req.body as ScheduleEventDTO;

      await repository.createSchedule(toScheduleEventDAL(event, user));
      return res.status(201).end();
    default:
      return res.status(404).json({ message: 'Not found' });
  }
}
