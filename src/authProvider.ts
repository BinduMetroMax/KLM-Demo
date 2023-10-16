import { AuthBindings } from "@refinedev/core";
import { axiosInstance } from "@refinedev/simple-rest";
import axios from "axios";
import nookies from "nookies";
axiosInstance


const LoginURl = "/api/auth/login"



export const authProvider: AuthBindings = {

  login: async ({ phone, code }) => {
    console.log(phone, "USER");
    console.log(code, "PASSWORD");

    try {
      const response = await axios.post(LoginURl, {
        phoneNumebr: phone,
      })
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }

    // const user = mockUsers[0];

    // if (user) {
    //   nookies.set(null, "auth", JSON.stringify(user), {
    //     maxAge: 60 * 60,
    //     path: "/",

    //   });
    return {
      success: false,
      redirectTo: "/",

    };
    // }


  },
  logout: async () => {
    nookies.destroy(null, "auth");
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async (ctx: any) => {
    const cookies = nookies.get(ctx);
    if (cookies["auth"]) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => {
    const auth = nookies.get()["auth"];
    if (auth) {
      const parsedUser = JSON.parse(auth);
      return parsedUser.roles;
    }
    return null;
  },
  getIdentity: async () => {
    const auth = nookies.get()["auth"];
    if (auth) {
      const parsedUser = JSON.parse(auth);
      return parsedUser;
    }
    return null;
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
