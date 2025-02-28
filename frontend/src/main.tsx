import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root";
import People from "./routes/people/[id]";
import { API_URL } from "./Constants";
import CreatePerson from "./routes/create";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "people/:id",
    element: <People />,
    loader: async ({ params }) => {
      try {
        return { data: "test" };
      } catch (error) {
        throw new Error(`Error fetching data: ${error}`);
      }
    },
  },
  {
    path: "create",
    element: <CreatePerson />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <RouterProvider router={router} />
    </Auth0Provider>
  </StrictMode>
);
