import { api, ApiErrorResponse, ApiSuccessResponse } from "@/services/api/api";
import jwt from "jwt-decode";
type SignInRequestData = {
  email: string;
  senha: string;
};

type SignInResponseData = { access_token: string };

type SignUpRequestData = {
  nome: string;
  email: string;
  senha: string;
};

export async function signInRequest({ email, senha }: SignInRequestData) {
  try {
    const {
      data: { access_token },
    } = await api.post<SignInResponseData>(`/auth/login`, {
      email,
      senha,
    });

    const { nome, id } = jwt<{ nome: string; id: string }>(access_token);
    return {
      user: {
        token: access_token,
        nome,
        id,
      },
    };
  } catch (error: any) {
    if (error?.response?.data) {
      const response = new ApiErrorResponse();
      Object.assign(response, error.response.data);
      throw response;
    }
    throw new Error(error?.message ?? "Internal server error");
  } finally {
  }
}

export async function signUpRequest({ email, senha, nome }: SignUpRequestData) {
  try {
    await api.post(`/users`, {
      email,
      senha,
      nome,
    });
  } catch (error: any) {
    if (error?.response?.data) {
      const response = new ApiErrorResponse();
      Object.assign(response, error.response.data);
      throw response;
    }
    throw new Error(error?.message ?? "Internal server error");
  } finally {
  }
}
