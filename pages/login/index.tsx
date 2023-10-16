
import { GetServerSideProps } from "next";
import { authProvider } from "src/authProvider";
import CustomLoginPage from "./CustomLogin";

export default function Login() {
  return (
    <CustomLoginPage />
  );
}

Login.noLayout = true;

// export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
//   const { authenticated, redirectTo } = await authProvider.check(context);

//   if (authenticated) {
//     return {
//       props: {},
//       redirect: {
//         destination: redirectTo ?? "/",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {},
//   };
// };
