import AppError from '@shared/errors/AppError';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  let fakeAppointmentRepository: FakeAppointmentRepository;
  let createAppointmentService: CreateAppointmentService;
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentRepository,
    );
  });
  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointmentService.execute({
      date: new Date(),
      provider_id: '123456789',
    });

    await expect(appointment).toHaveProperty('id');
    await expect(appointment.provider_id).toBe('123456789');
  });
  it('should not be able to create two appointments on same date', async () => {
    const appointmentDate = new Date(2020, 6, 29, 11);
    await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: '123456789',
    });

    await expect(
      createAppointmentService.execute({
        date: appointmentDate,
        provider_id: '123456789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
