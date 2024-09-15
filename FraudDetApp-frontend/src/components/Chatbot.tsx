import React, { FC, useEffect, useState, useRef } from "react";
import { Card, CardBody, CardFooter, Typography, Input, Button } from "@material-tailwind/react";
import ThreeScene from "./ThreeScene"; // Import the 3D scene

interface IMessage {
    role: string;
    content: string;
}

const ChatGPT: FC = () => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: IMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        let buffer = "";
        const assistantMessage: IMessage = { role: "assistant", content: "" };
        setMessages((prev) => [...prev, assistantMessage]);

        const eventSource = new EventSource(
            `http://localhost:8000/api/chatbot/?message=${encodeURIComponent(input)}`
        );

        eventSource.onmessage = (event) => {
            const responseObject = JSON.parse(event.data);
            buffer += responseObject.content || "";

            buffer = buffer.replace(/\s+/g, " ").trim();

            setTimeout(() => {
                setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1].content = buffer;
                    return updated;
                });
            }, 100); // 100ms delay, adjust as needed
        };

        eventSource.onerror = (error) => {
            console.log("Error with SSE connection:", error);
            eventSource.close();
            setIsLoading(false);
        };
    };

    return (
        <div className="relative w-full h-[100vh] flex items-center justify-center">
            {/* 3D Scene in the background */}
            <ThreeScene />
            {/* Chat UI */}
            <Card placeholder={undefined}
                className="w-full max-w-[800px] h-[80vh] flex flex-col relative z-10 bg-opacity-70 backdrop-blur-lg">
                <CardBody placeholder={undefined} className="flex-grow overflow-y-auto p-4">
                    {messages.map((message, index) => (
                        <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
                            <Typography
                                placeholder={undefined}
                                variant="paragraph"
                                color={message.role === "user" ? "blue" : "gray"}
                                className={`inline-block p-3 rounded-lg ${message.role === "user" ? "bg-blue-100 text-blue-900" : "bg-gray-100 text-gray-900"
                                    }`}
                            >
                                {message.content}
                            </Typography>
                            <Typography variant="small" color="gray" placeholder={undefined} className="mt-1 text-xs">
                                {new Date().toLocaleTimeString()}
                            </Typography>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </CardBody>
                <CardFooter placeholder={undefined} className="p-4">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <Input

                            type="text"
                            placeholder="Type your message here..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-grow"
                            crossOrigin={undefined}
                        />
                        <Button placeholder={undefined} type="submit" disabled={isLoading}>
                            {isLoading ? "Thinking..." : "Send"}
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ChatGPT;
