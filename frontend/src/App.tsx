import { SelectPeople } from "./components/select-people";
import { Button } from "./components/ui/button";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { loginWithRedirect } = useAuth0();
  const { user, isAuthenticated, isLoading } = useAuth0();

  return (
    <>
      <div className="relative h-screen w-screen">
        <div className="absolute inset-0 bg-hero bg-no-repeat bg-cover"></div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 grid place-items-center h-full">
          <main className="text-white text-center">
            <h1 className="font-bold text-5xl text-white">
              Welcome to E-Graveyard!
            </h1>
            <p className="mt-4 mb-3 text-2xl">
              Where your loved ones are remembered forever.
            </p>
            {isLoading && <p className="text-lg">Loading...</p>}
            {isAuthenticated && !isLoading ? (
              <div className="mx-auto">
                <SelectPeople />
              </div>
            ) : (
              <Button
                className="mx-auto mt-4 block text-lg"
                size="lg"
                variant="secondary"
                onClick={() => loginWithRedirect()}
              >
                Sign In
              </Button>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default App;

// import { useEffect } from "react";
// import { Button } from "./components/ui/button";
// import { useAuth0 } from "@auth0/auth0-react";

// function App() {
//   const { loginWithRedirect } = useAuth0();
//   const { user, isAuthenticated, isLoading } = useAuth0();

//   useEffect(() => {
//     const addUserToDatabase = async () => {
//       if (isAuthenticated && user) {
//         try {
//           const response = await fetch("/api/check-user", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ email: user.email }),
//           });

//           const data = await response.json();

//           if (!data.exists) {
//             await fetch("/api/add-user", {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify(user),
//             });
//           }
//         } catch (error) {
//           console.error("Error adding user to database:", error);
//         }
//       }
//     };

//     addUserToDatabase();
//   }, [isAuthenticated, user]);

//   return (
//     <>
//       <Button onClick={() => loginWithRedirect()}>Click me</Button>

//       {isAuthenticated && <pre>{JSON.stringify(user, null, 2)}</pre>}
//     </>
//   );
// }

// export default App;
