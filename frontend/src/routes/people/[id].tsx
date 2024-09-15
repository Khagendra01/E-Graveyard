import React, { useEffect, useState } from "react";
import BgViewWrapper from "@/components/bg-view-wrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { ArrowLeft } from "lucide-react";
import { Link, useLoaderData, useParams } from "react-router-dom";
import ChatModal from "@/components/chat-modal";
import { API_URL } from "@/Constants";
import axios from "axios";

export default function People() {
  const { id } = useParams<{ id: string }>();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const options = {
        method: "GET",
        url: `${API_URL}/api/graves/${id}/`,
        headers: { "content-type": "application/json" },
      };

      try {
        const { data } = await axios.request(options);
        console.log(data);
        setPageData(data)
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  if (!pageData) return <div>Loading...</div>;

  return (
    <BgViewWrapper>
      <div className="relative z-10 min-h-screen p-16">
        <Link to="/" className={`${buttonVariants({ variant: "secondary" })}`}>
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back{" "}
        </Link>

        <div className="flex gap-8 mt-6">
          <img
            src={pageData.image}
            alt=""
            className="w-80 h-80 aspect-auto object-cover rounded-md"
          />
          <div className="max-w-lg">
            <div className="space-y-3">
              <h1 className="text-5xl font-bold text-white">{pageData.name} {pageData.surname}</h1>
              <p className="text-2xl text-white">{new Date(pageData.dob).getFullYear()} - {new Date(pageData.dod).getFullYear()}</p>
              <p className="text-white">
               {pageData.content.slice(0,400)}...
              </p>
            </div>

            <Button
              variant="secondary"
              className="text-lg mt-5 py-4"
              onClick={openChat}
            >
              <ChatBubbleIcon className="mr-2 h-5 w-5" /> Chat with me
            </Button>
          </div>
        </div>
      </div>
      <ChatModal
        personName={`${pageData.name} ${pageData.surname}`}
        isOpen={isChatOpen}
        onClose={closeChat}
        voice_id={pageData.voice_id}
        grave_id={pageData.id}
      />
    </BgViewWrapper>
  );
}
