import { getAccessToken } from "@/lib/auth";

export default class AuthService {
  async login(user: any) {
    console.log(user);
    try {
      const response = await fetch(
        `https://part-back.onrender.com/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        },
      );
      if (!response.ok) {
        console.error(await response.json());
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { token } = await response.json();
      return token;
    } catch (error) {
      console.error("Error al autenticar al usuario", error);
    }
  }

  async register(email: string, name: string, password: string) {
    try {
      console.log("Entro");
      const response = await fetch(
        `https://part-back.onrender.com/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, name, password }),
        },
      );
      if (response.status === 409) {
        throw new Error(
          `HTTP error! status: ${response.status}: User with email ${email} already exists`,
        );
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error al registrar al usuario", error);
    }
  }

  async profile(token?: string) {
    const value = token ?? getAccessToken();
    try {
      const response = await fetch(
        `https://part-back.onrender.com/auth/verify`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${value}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { user } = await response.json();
      return user;
    } catch (error) {
      console.error("Error al verificar al usuario", error);
    }
  }

  async updatePassword(id: string, prev_pw: string, new_pw: string) {
    try {
      const response = await fetch(
        `https://part-back.onrender.com/auth/${id}/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prev_pw, new_pw }),
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error al actualizar la contraseña del usuario", error);
    }
  }
}
