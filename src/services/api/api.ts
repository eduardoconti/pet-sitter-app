import { getAPIClient } from "@/services/api/axios";

export const api = getAPIClient();

export class ApiErrorResponse {
  status!: number;
  title!: string;
  type!: string;
  detail?: string;
  invalidFields?: InvalidFields[];
}

export interface ApiSuccessResponse<T> {
  status: number;
  internalMessage: string;
  message: string;
  data: T;
}

type InvalidFields = {
  field: string;
  reason: string;
};
