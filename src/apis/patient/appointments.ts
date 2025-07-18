import { useMutation, useQuery } from '@tanstack/react-query';
import type { AppointmentTypeEnum } from '../../interfaces/enums';
import type {
	AppointmentSlotResponse,
	AppointmentsResponse,
	CommonApiResponse,
	PayloadPaginationType,
} from '../../interfaces/responseTypes';
import { apiClient } from '../../lib/api';
import { toast } from 'react-toastify';
import type { BookAppointmentInput } from '../../interfaces/formInputTypes';

type GetAppointmentsQueryParams = PayloadPaginationType & {
	type: AppointmentTypeEnum;
};

export function useGetAppointmentsQuery({ page, limit, type }: GetAppointmentsQueryParams) {
	return useQuery({
		queryKey: ['get-appointments'],
		queryFn: (): Promise<AppointmentsResponse> =>
			apiClient.get(`patients/appointments`, { page, limit, type }),
	});
}

export function useGetDoctorAppointmentSlotQuery({
	id,
	appointment_date,
}: {
	id?: string;
	appointment_date?: string;
}) {
	return useQuery({
		queryKey: ['get-appointment-slots', id, appointment_date],
		queryFn: (): Promise<AppointmentSlotResponse> =>
			apiClient.get(`patients/doctor-available-slots`, { doctor_id: id, appointment_date }),
	});
}

export function useBookAppointmentMutation() {
	return useMutation<CommonApiResponse, CommonApiResponse, BookAppointmentInput>({
		mutationFn: (values) => apiClient.post(`patients/appointments`, values),
		onError: ({ message }) => toast.error(message || 'Something went wrong'),
	});
}
