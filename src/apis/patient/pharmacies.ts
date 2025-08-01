import { useMutation, useQuery } from '@tanstack/react-query';
import type {
	Cart,
	DoctorSpecialtiesType,
	MedicineDetail,
	MedicineFullDetail,
	Pharmacy,
	PharmacyFilterType,
	PharmacyInfo,
	PopularProduct,
} from '../../interfaces';
import type {
	CommonApiResponse,
	PayloadPaginationType,
	ResponsePagination,
} from '../../interfaces/responseTypes';

import type { MedicinesByCategory } from '../../interfaces';
import { apiClient } from '../../lib/api';
import { useMedicineCategoriesStore } from '../../store/medicineCategories';

type GetPharmaciesQueryParams = PayloadPaginationType &
	PharmacyFilterType & {
		search: string;
		category: string;
	};
type PharmaciesResponse = CommonApiResponse & {
	data: { items: Pharmacy[]; meta: ResponsePagination };
};

export function useGetPharmaciesQuery({
	page,
	limit,
	showOpen,
	location,
	search,
	category,
}: GetPharmaciesQueryParams) {
	return useQuery({
		queryKey: ['get-pharmacies'],
		queryFn: (): Promise<PharmaciesResponse> =>
			apiClient.get(`patients/pharmacies`, {
				page,
				limit,
				only_show_open: showOpen,
				...(location && { location }),
				...(category && { category }),
				...(search && { search }),
			}),
	});
}

export function useGetMedicinesCategoriesQuery() {
	const { medicineCategories } = useMedicineCategoriesStore((state) => state);

	return useQuery({
		queryKey: ['get-medicine-categories'],
		queryFn: (): Promise<{
			data: { medicineCategories: DoctorSpecialtiesType[] };
		}> => apiClient.get(`pharmacy/medicine/categories`),
		enabled: !medicineCategories.length,
	});
}

type PharmacyDetailsResponse = {
	data: { pharmacy: PharmacyInfo; medicinesByCategory: MedicinesByCategory };
};
export function useGetPharmacyDetailQuery({ id }: { id?: string }) {
	return useQuery({
		queryKey: ['get-pharmacy-detail', id],
		queryFn: (): Promise<PharmacyDetailsResponse> => apiClient.get(`patients/pharmacy/${id}`),
	});
}

type PharmacyMedicinesDetailResponse = {
	data: { medicines: MedicineDetail[]; meta: ResponsePagination };
};
export function useGetPharmacyMedicinesQuery({
	id,
	search,
	category,
	page,
	limit,
}: {
	id?: string;
	search: string;
	category: string;
	page: number;
	limit: number;
}) {
	return useQuery({
		queryKey: ['get-medicines-detail', id, search, page],
		queryFn: (): Promise<PharmacyMedicinesDetailResponse> =>
			apiClient.get(`patients/pharmacy/${id}/medicines`, {
				...(search && { search }),
				...(category && { category }),
				page,
				limit,
			}),
	});
}

type MedicineDetailResponse = {
	data: {
		medicine: MedicineFullDetail;
		popularProducts: PopularProduct[];
	};
};
export function useGetPharmacyMedicineDetailQuery({ id }: { id?: string }) {
	return useQuery({
		queryKey: ['get-pharmacy-medicine-detail', id],
		queryFn: (): Promise<MedicineDetailResponse> => apiClient.get(`patients/medicine/${id}`),
		enabled: !!id,
	});
}

type UpdateCartItemQuantityInput = {
	cart_item_id: number;
	quantity: number;
};
type UpdateCartItemQuantityResponse = CommonApiResponse & {
	data: {
		cart_id: number;
		total_items: number;
		cart_total: number;
		item_subtotal: number;
		item_removed: boolean;
		cart_deleted: boolean;
	};
};

export function useUpdateCartItemQuantityMutation() {
	return useMutation<
		UpdateCartItemQuantityResponse,
		CommonApiResponse,
		UpdateCartItemQuantityInput
	>({
		mutationFn: (values) => apiClient.put(`patients/update-cart-item-quantity`, values),
	});
}

type AddToCartInput = {
	medicine_id?: string;
	quantity: number;
};
export function useAddToCartMutation() {
	return useMutation<CommonApiResponse, CommonApiResponse, AddToCartInput>({
		mutationFn: (values) => apiClient.post(`patients/add-to-cart`, values),
	});
}

type CartResponse = {
	data: {
		carts: Cart[];
		total_amount: number;
		total_items: number;
		pharmacy_count: number;
	};
};
export function useGetCartItemsQuery() {
	return useQuery({
		queryKey: ['get-patient-cart'],
		queryFn: (): Promise<CartResponse> => apiClient.get(`patients/cart`),
	});
}
