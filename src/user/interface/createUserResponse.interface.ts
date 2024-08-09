export interface CreateUserResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
  };
}
