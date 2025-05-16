import { UserSimpleResponse } from "../../utils/type";

interface IUserService {
  listUsers(): Promise<UserSimpleResponse[]>;
}

export class UserService implements IUserService {
  constructor(
    private accessToken: string,
    private server_url: string,
  ) {}

  async listUsers(): Promise<UserSimpleResponse[]> {
    const response = await fetch(`${this.server_url}/api/v1/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.json();
  }
}
