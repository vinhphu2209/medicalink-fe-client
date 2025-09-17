export interface ApiResponse<T = unknown> {
	data: T;
	message: string;
	statusCode: number;
	timestamp: string;
	path: string;
}

export interface ApiError {
	message: string;
	statusCode: number;
	timestamp: string;
	path: string;
	error?: string;
}
