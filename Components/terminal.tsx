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

const Terminal = () => {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<TerminalLine[]>([
    { text: "Welcome!", isCommand: false },
    { text: 'Type "help" to see available commands', isCommand: false },
  ]);
  const [typing, setTyping] = useState<boolean>(false);
  const [typedText, setTypedText] = useState<string>("");

  const endOfTerminalRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll
  useEffect(() => {
    endOfTerminalRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output, typedText]);

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

  const projectDetails: { [key: string]: CommandOutput } = {
    "1": [
      "AI-powered Recommendation System:",
      "• Built with Python, TensorFlow, and React.",
      "• Delivers personalized content suggestions using collaborative filtering.",
      "• Deployed on AWS with scalable microservices.",
    ],
    "2": [
      "Computer Vision Application:",
      "• Uses PyTorch for image classification and object detection.",
      "• Real-time processing with optimized inference pipeline.",
      "• Integrated with web dashboard for visualization.",
    ],
    "3": [
      "Full-stack Web Application:",
      "• Next.js frontend, Node.js backend, MongoDB database.",
      "• Features authentication, RESTful APIs, and responsive UI.",
      "• Deployed on GCP with CI/CD automation.",
    ],
  };

  // Typing effect for last output line
  useEffect(() => {
    // Only type the last line if it's not a command and is a string
    const last = output[output.length - 1];
    if (last && !last.isCommand && typeof last.text === "string") {
      setTyping(true);
      setTypedText("");
      let index = 0;
      const text = last.text as string;
      const speed = 30;
      let cancelled = false;

      const typeNext = () => {
        if (cancelled) return;
        if (index <= text.length) {
          setTypedText(text.slice(0, index));
          index++;
          if (index <= text.length) {
            setTimeout(typeNext, speed);
          } else {
            setTyping(false);
          }
        }
      };
      typeNext();

      return () => {
        cancelled = true;
      };
    } else {
      setTyping(false);
      setTypedText("");
    }
  }, [output]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (input === "clear") {
      setOutput([]);
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
      if (projectDetails[projectNum]) {
        newOutput = [
          ...newOutput,
          ...projectDetails[projectNum].map((line) => ({
            text: line,
            isCommand: false,
          })),
        ];
      } else {
        newOutput.push({
          text: `Project ${projectNum} doesn't exist.`,
          isCommand: false,
        });
      }
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
            const isLastLine =
              index === output.length - 1 &&
              !item.isCommand &&
              typeof item.text === "string";
            if (isLastLine && typing) {
              return (
                <div
                  key={`output-${index}-typing`}
                  className="text-gray-300 mb-2 pl-3 sm:pl-4 md:pl-6"
                >
                  {typedText}
                </div>
              );
            }
            return (
              <div
                key={`output-${index}-${item.isCommand ? "cmd" : "out"}`}
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
