export interface ApiErrorDetail {
  status: number;
  data?: unknown;
  message?: string;
}

export class ApiError extends Error implements ApiErrorDetail {
  status: number;
  data?: unknown;

  constructor(detail: ApiErrorDetail) {
    super(detail.message ?? `Request failed with status ${detail.status}`);
    this.name = "ApiError";
    this.status = detail.status;
    this.data = detail.data;
  }
}

/** Dùng cho client fetch khi muốn nhận union thay vì throw */
export type ApiErrorResult = { error: true } & ApiErrorDetail;
