"use client";
import { useState, useEffect, useRef, FormEvent } from "react";
import terminalBg from "@/public/final_bg.jpg";
import { JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";

type CommandOutput = ReactNode[];

type CommandFunction = () => CommandOutput;

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

interface CommandSet {
  [key: string]: CommandFunction;
}

interface TerminalLine {
  text: ReactNode; // string | JSX allowed
  isCommand: boolean;
}

// Typing effect hook
const useTypingEffect = (text: string, speed: number = 30) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText(""); // Reset when text changes
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return displayedText;
};
// Component to display typed line
const TerminalLineDisplay = ({
  text,
  isCommand,
  speed = 10,
}: {
  text: ReactNode;
  isCommand: boolean;
  speed?: number;
}) => {
  if (typeof text === "string") {
    const typedText = useTypingEffect(text, speed);
    return (
      <div
        key={`display-${Date.now()}`}
        className={`${
          isCommand ? "text-green-400" : "text-gray-300"
        } mb-2 pl-3 sm:pl-4 md:pl-6`}
      >
        {typedText}
      </div>
    );
  }
  return (
    <div
      key={`display-${Date.now()}`}
      className={`${
        isCommand ? "text-green-400" : "text-gray-300"
      } mb-2 pl-3 sm:pl-4 md:pl-6`}
    >
      {text}
    </div>
  );
};

const Terminal = () => {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<TerminalLine[]>([
    { text: "Welcome!", isCommand: false },
    { text: 'Type "help" to see available commands', isCommand: false },
  ]);

  const endOfTerminalRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll
  useEffect(() => {
    endOfTerminalRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output]);

  const commands: CommandSet = {
    help: () => [
      "Available commands:",
      '"about" - Show about information',
      '"skills" - List my technical skills',
      '"projects" - View my projects',
      '"contact" - Get contact information',
      '"clear" - Clear the terminal',
    ],
    about: () => [
      "I'm Kanini Joseph, an AI Developer and Software Engineer",
      "Passionate about building intelligent solutions with code",
      "Specialized in machine learning, deep learning, and full-stack development",
    ],
    skills: () => [
      "Technical Skills:",
      "• Machine Learning (TensorFlow, PyTorch)",
      "• Python, JavaScript/TypeScript",
      "• React, Next.js, Node.js",
      "• SQL & NoSQL databases",
      "• Cloud platforms (AWS, GCP)",
    ],
    projects: () => [
      "Featured Projects:",
      "1. AI-powered recommendation system",
      "2. Computer vision application",
      "3. Full-stack web application",
      'Type "project [number]" for details',
    ],
    contact: (): CommandOutput => [
      "Contact Information:",
      "Email: kanini@example.com",
      <span key="github">
        GitHub:{" "}
        <a
          href="https://github.com/kaninijoseph"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          github.com/kaninijoseph
        </a>
      </span>,
      <span key="linkedin">
        LinkedIn:{" "}
        <a
          href="https://linkedin.com/in/kanini"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          linkedin.com/in/kanini
        </a>
      </span>,
    ],
    clear: () => [],
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (input === "clear") {
      setOutput([]); // CHANGED: Clear all output completely
      setInput("");
      return;
    }

    let newOutput: TerminalLine[] = [
      ...output,
      { text: input, isCommand: true },
    ];

    if (commands[input]) {
      newOutput = [
        ...newOutput,
        ...commands[input]().map((line) => ({
          text: line,
          isCommand: false,
        })),
      ];
    } else if (input.startsWith("project ")) {
      const projectNum = input.split(" ")[1];
      newOutput.push({
        text: `Details for project ${projectNum} coming soon!`,
        isCommand: false,
      });
    } else if (input) {
      newOutput.push({ text: `Command not found: ${input}`, isCommand: false });
    }

    setOutput(newOutput);
    setInput("");
  };

  return (
    <div className="w-full mt-1 h-full">
      {/* Terminal top bar */}
      <div className="flex items-center bg-gray-900 px-4 py-2 border-b border-gray-700  w-full h-[5%]">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="ml-4 text-gray-300 text-sm">Terminal</div>
      </div>
      <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden h-[95%]">
        {/* Terminal body */}
        <div
          className={`p-4 font-mono text-gray-100 h-full  overflow-y-auto ${jetbrainsMono.className}`}
          style={{
            backgroundImage: `url(${terminalBg.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay",
            backgroundColor: "rgba(31, 41, 55, 0.85)",
          }}
        >
          {output.map((item, index) => {
            const isLastLine = index === output.length - 1 && !item.isCommand;
            return isLastLine ? (
              <TerminalLineDisplay
                key={`output-${index}-${item.isCommand ? "cmd" : "out"}`}
                text={
                  item.isCommand ? `@ng'ashjoseph/${item.text} ~$` : item.text
                }
                isCommand={item.isCommand}
              />
            ) : (
              <div
                className={
                  item.isCommand
                    ? "text-green-400 mb-2 "
                    : "text-gray-300 mb-2 pl-3 sm:pl-4 md:pl-6"
                }
              >
                {item.isCommand ? `@ng'ashjoseph/${item.text} ~$` : item.text}
              </div>
            );
          })}

          <div ref={endOfTerminalRef} />

          {/* Command input */}
          <form onSubmit={handleSubmit} className="mt-2">
            <div className="flex flex-wrap items-baseline">
              <span className="text-green-400 whitespace-nowrap mr-2">
                @ng'ashjoseph ~$
              </span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.toLowerCase())}
                className="bg-transparent border-none outline-none text-gray-100 flex-grow min-w-[50%]"
                autoFocus
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
