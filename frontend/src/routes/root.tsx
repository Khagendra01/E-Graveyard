import { useEffect, useState } from "react";
import Cemetery from "../components/cemetery";
import { Button } from "../components/ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import { API_URL } from "../Constants";
import BgViewWrapper from "@/components/bg-view-wrapper";
import { SpeakerLoudIcon, SpeakerOffIcon } from "@radix-ui/react-icons";
import AudioPlayer from "@/components/audio-player";

function Root() {
  const { loginWithRedirect } = useAuth0();
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } =
    useAuth0();
  const [pageData, setPageData] = useState([])

  useEffect(() => {
    async function getPageData() {
      const data = await fetch(API_URL+'/api/graves/')
      const resData = await data.json()
      setPageData(resData)
      console.log({resData})
    }

    getPageData()
  }, [])

  useEffect(() => {
    const addUserToDatabase = async () => {
      if (isAuthenticated && user) {
        try {
          const res = await fetch(API_URL + "/api/add-user/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              full_name: user.family_name,
              image: user.picture,
            }),
          });
          const resData = await res.json();
          console.log("User added to database:", resData);
        } catch (error) {
          console.error("Error adding user to database:", error);
        }
      }
    };

    addUserToDatabase();
  }, [isAuthenticated, user]);

  return (
    <>
      <BgViewWrapper>
        <div className="relative z-10 flex items-center justify-center min-h-screen p-12">
          <main className="text-white text-center">
            <h1 className="font-bold text-5xl text-white">
              Welcome to E-Graveyard! <AudioPlayer src="/track.mp3" />
            </h1>
            <p className="mt-4 mb-3 text-2xl">
              Where your loved ones are remembered forever.
            </p>
            {isAuthenticated && !isLoading ? (
              <footer className="flex justify-center gap-6 flex-wrap mt-16">
                {
                  pageData.map(data => (
                    <Cemetery
                  imageName="1"
                  personImage={data.image}
                  id={data.id}
                  name={data.name + ' ' + data.surname}
                />
                  ))
                }
                
                <Cemetery
                  personImage="plus"
                  imageName="4"
                  id="create"
                  name="Add Person"
                />
              </footer>
            ) : isLoading ? (
              <p className="text-lg">Loading...</p>
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
      </BgViewWrapper>
    </>
  );
}

export default Root;
