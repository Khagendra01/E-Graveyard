import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { sender: "me", text: "Hello! How can I help you today?" },
    { sender: "person", text: "I need some information about your services." },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { sender: "me", text: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle>Chat with us</DialogTitle>
          <DialogDescription>Start a conversation</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {/* Chat UI */}
          <div className="h-64 bg-gray-800 p-4 rounded-lg overflow-y-auto flex flex-col gap-4">
            {messages.map((message, index) => (
              <div
                key={index}
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
                    <AvatarFallback>P</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`p-3 rounded-lg max-w-xs ${
                    message.sender === "me"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-600 text-white rounded-bl-none"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <Input
              type="text"
              className="flex-grow p-2 border rounded-l-lg bg-gray-900 text-white"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button
              variant="outline"
              className=""
              size="icon"
              onClick={handleSendMessage}
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
      </DialogContent>
    </Dialog>
  );
};

export default ChatModal;
