import { useTranslation } from 'react-i18next';
import { PaginationBackIcon, PaginationNextIcon } from '../../assets/icons';
import { PaginationSkeleton } from './skeletons/PaginationSkeleton';

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	isLoading?: boolean;
}

export const Pagination = ({
	currentPage,
	totalPages,
	onPageChange,
	isLoading = false,
}: PaginationProps) => {
	const { t } = useTranslation();
	const handlePrevious = () => {
		if (currentPage > 1) onPageChange(currentPage - 1);
	};

	const handleNext = () => {
		if (currentPage < totalPages) onPageChange(currentPage + 1);
	};
	return isLoading ? (
		<PaginationSkeleton />
	) : (
		<nav
			className="flex justify-between items-center gap-x-1 pt-5 border-t border-t-border-1"
			aria-label="Pagination"
		>
			<button
				className="pagination-btn"
				onClick={handlePrevious}
				disabled={isLoading || currentPage === 1}
			>
				<PaginationBackIcon />
				<span aria-hidden="true" className="hidden sm:block">
					{t('previous')}
				</span>
			</button>

			<div className="flex-items-center gap-x-1">
				{Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
					<button
						key={pageNum}
						disabled={isLoading}
						className={`min-h-9.5 min-w-9.5 flex justify-center items-center py-2 px-3 text-sm rounded-lg focus:outline-hidden ${
							pageNum === currentPage
								? 'bg-primary text-white'
								: 'cursor-pointer text-gray-800 hover:bg-gray-100'
						}`}
						onClick={() => onPageChange(pageNum)}
					>
						{pageNum}
					</button>
				))}
			</div>

			<button
				className="pagination-btn"
				onClick={handleNext}
				disabled={isLoading || currentPage === totalPages}
			>
				<span aria-hidden="true" className="hidden sm:block">
					{t('next')}
				</span>
				<PaginationNextIcon />
			</button>
		</nav>
	);
};
