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
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    const appointment = await createAppointmentService.execute({
      date: new Date(2020, 4, 10, 13),
      provider_id: '123456789',
      user_id: '123123',
    });

    await expect(appointment).toHaveProperty('id');
    await expect(appointment.provider_id).toBe('123456789');
  });
  it('should not be able to create two appointments on same date', async () => {
    const appointmentDate = new Date(2020, 10, 29, 11);
    await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: '123456789',
      user_id: '123123',
    });

    await expect(
      createAppointmentService.execute({
        date: appointmentDate,
        provider_id: '123456789',
        user_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 10, 11),
        provider_id: '123456789',
        user_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 10, 13),
        provider_id: '123123',
        user_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create appointment outside of business hours', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 11, 7),
        provider_id: 'provider',
        user_id: 'user',
      }),
    ).rejects.toBeInstanceOf(AppError);
    await expect(
      createAppointmentService.execute({
        date: new Date(2020, 4, 10, 18),
        provider_id: 'provider',
        user_id: 'user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
