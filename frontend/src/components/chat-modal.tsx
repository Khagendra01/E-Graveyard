import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaperPlaneIcon, PlayIcon } from "@radix-ui/react-icons";
import { Loader2Icon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DialogModalWrapper from "@/components/dialog-modal-wrapper";
import { DialogDescription, DialogFooter, DialogTitle } from "./ui/dialog";
import { useAuth0 } from "@auth0/auth0-react";
import { API_URL } from "@/Constants";
// import { ElevenLabsClient, ElevenLabs } from "elevenlabs";
import axios from "axios";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  personName: string;
  voice_id: string;
  grave_id: string;
}

const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  personName,
  voice_id,
  grave_id,
}) => {
  const [messages, setMessages] = useState([
    { sender: "person", text: "Hello! How can I help you today?" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioStatus, setAudioStatus] = useState([
    { isLoading: false, id: "" },
  ]);
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth0();

  const XI_API_KEY = import.meta.env.VITE_XI_API_KEY;

  const generateVoice = async (id: string, text: string) => {
    setAudioStatus((prev) => [...prev, { isLoading: true, id: id }]);

    const baseUrl = "https://api.elevenlabs.io/v1/text-to-speech";
    const headers = {
      "Content-Type": "application/json",
      "xi-api-key": XI_API_KEY,
    };

    const requestBody = {
      text,
      voice_settings: {
        stability: 0.1,
        similarity_boost: 0.3,
        style: 0.2,
      },
    };

    try {
      const response = await axios.post(
        `${baseUrl}/${voice_id}`,
        requestBody,
        {
          headers,
          responseType: "blob",
        }
      );

      if (response.status === 200) {
        const audioUrl = URL.createObjectURL(response.data);
        setAudioStatus((prev) =>
          prev.map((status) =>
            status.id === id
              ? { ...status, isLoading: false, audioUrl: audioUrl }
              : status
          )
        );
      } else {
        throw new Error("Failed to generate voice");
      }
    } catch (error) {
      console.error("Error generating voice:", error);
      setAudioStatus((prev) =>
        prev.map((status) =>
          status.id === id
            ? { ...status, isLoading: false, error: error.message }
            : status
        )
      );
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") {
      return; // Do not send empty messages
    }

    setIsLoading(true);

    try {
      let currentChatId = chatId;

      if (currentChatId === "") {
        // Create a chatbox with the person
        const chatData = await fetch(API_URL + "/api/chat-messages/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: user?.email,
            grave: Number(grave_id),
          }),
        });

        if (!chatData.ok) {
          throw new Error("Failed to create chat");
        }

        const chatDataJson = await chatData.json();
        console.log({ chatDataJson });
        currentChatId = chatDataJson.id;
        setChatId(currentChatId);

        // const voiceData = await fetch(API_URL + `/api/get-voice/?grave_id=${grave_id}`);
        // if (!voiceData.ok) {
        //   throw new Error("Failed to get voice");
        // }
        // const voiceDataJson = await voiceData.json();
        // setVoiceId(voiceDataJson.voice_id);
      }

      // Send user message to AI
      const aiData = await fetch(API_URL + "/api/messages/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_msg: newMessage,
          message: Number(currentChatId),
        }),
      });

      if (!aiData.ok) {
        throw new Error("Failed to send message to AI");
      }

      const aiDataJson = await aiData.json();
      console.log({ aiDataJson });
      const { ai_msg } = aiDataJson;

      // Update messages state
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "me", text: newMessage },
        { sender: "person", text: ai_msg, id: aiDataJson.id },
      ]);

      // Clear the input field
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      dialogHeaderContent={
        <>
          <DialogTitle>Chat with {personName}</DialogTitle>
          <DialogDescription>Start a conversation</DialogDescription>
        </>
      }
    >
      <div className="mt-4">
        {/* Chat UI */}
        <div className="max-h-[524px] bg-gray-800 p-4 rounded-lg overflow-y-auto flex flex-col gap-4">
          {messages.map((message, index) => {
            const audioStatusForMessage = audioStatus.find(
              (status) => status.id === message.id
            );

            return (
              <React.Fragment key={index}>
                <div
                  className={`flex ${
                    message.sender === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender === "person" && (
                    <Avatar className="mr-2">
                      <AvatarImage
                        src="/path/to/person-avatar.png"
                        alt="Person"
                      />
                      <AvatarFallback className="text-black">
                        {personName[0]}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`p-3 rounded-lg max-w-xl ${
                      message.sender === "me"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-600 text-white rounded-bl-none"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
                {message.sender === "person" && (
                  <div className="flex items-center gap-2 text-sm">
                    {audioStatusForMessage?.isLoading ? (
                      <Loader2Icon className="animate-spin h-5 w-5 text-white" />
                    ) : audioStatusForMessage?.error ? (
                      <span className="text-red-500">
                        Error: {audioStatusForMessage.error}
                      </span>
                    ) : audioStatusForMessage?.audioUrl ? (
                      <audio controls src={audioStatusForMessage.audioUrl} />
                    ) : (
                      <button
                        className="w-fit flex items-center gap-2 text-sm"
                        onClick={() => generateVoice(message.id, message.text)}
                      >
                        <PlayIcon /> Request audio
                      </button>
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}
          {isLoading && (
            <div className="flex justify-center">
              <Loader2Icon className="animate-spin h-5 w-5 text-white" />
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <Input
            type="text"
            className="flex-grow p-2 border border-gray-500 rounded-l-lg bg-gray-900 text-white"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isLoading}
          />
          <Button
            variant="outline"
            className=""
            size="icon"
            onClick={handleSendMessage}
            disabled={isLoading}
          >
            <PaperPlaneIcon className="h-5 w-5 text-black" />
          </Button>
        </div>
      </div>
      <DialogFooter>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </DialogModalWrapper>
  );
};

export default ChatModal;
