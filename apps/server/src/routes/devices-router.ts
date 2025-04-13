import { Request, Response, Router } from 'express';
import { DeviceRepository } from '../db/device-repository';
const router = Router();

router.get('/devices', async (_: Request, res: Response) => {
  const devices = await DeviceRepository.getAll();

  res.json(devices);
});

export { router as devicesRouter };
