export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  succeeded: boolean;
  status: number;
  message: string;
  data: {
    user: {
      userID: number;
      fullName: string;
      username: string;
      status: string;
      lastLogin: string;
    };
    roles: string[];
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: string;
    refreshTokenExpires: string;
  };
  traceId: string;
}


