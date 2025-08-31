export interface LoginRequest {
  username: string; // كان email عندك، بس الـ API يستعمل username
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
      doctorID: number;
      status: string;
      lastLogin: string;
      email: string;
    };
    doctor: {
      doctorID: number;
      fullName: string;
      specializationID: number;
      contractTypeID: number;
      code: string;
    };
    roles: string[];
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: string;
    refreshTokenExpires: string;
  };
  traceId: string;
}
