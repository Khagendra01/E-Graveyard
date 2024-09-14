import React, { useState } from "react";
import BgViewWrapper from "@/components/bg-view-wrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ChatModal from "@/components/chat-modal";

export default function People() {
  const { id } = useParams<{ id: string }>();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  return (
    <BgViewWrapper>
      <div className="relative z-10 min-h-screen p-16">
        <Link to="/" className={`${buttonVariants({ variant: "secondary" })}`}>
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back{" "}
        </Link>

        <div className="flex gap-8 mt-6">
          <img
            src="/people/steve-jobs.webp"
            alt=""
            className="w-80 h-80 aspect-auto object-cover rounded-md"
          />
          <div className="max-w-lg">
            <div className="space-y-3">
              <h1 className="text-5xl font-bold text-white">Steve Jobs</h1>
              <p className="text-2xl text-white">1955 - 2011</p>
              <p className="text-white">
                Steven Paul Jobs was an American business magnate, industrial
                designer, and media proprietor. He was the chairman, chief
                executive officer (CEO), and co-founder of Apple Inc., the
                chairman and majority shareholder of Pixar, a member of The Walt
                Disney Company's board of directors following its acquisition of
                Pixar,
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
      <ChatModal isOpen={isChatOpen} onClose={closeChat} />
    </BgViewWrapper>
  );
}
