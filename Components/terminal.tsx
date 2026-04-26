"use client";
import { useState, useEffect, useRef, FormEvent } from "react";
import terminalBg from "@/public/final_bg.jpg";
import { JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { PROJECTS } from "../constants/constants";

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
  text: ReactNode;
  isCommand: boolean;
}

interface TerminalProps {
  onProjectSelect?: (img: string | null) => void;
}

const Terminal = ({ onProjectSelect }: TerminalProps) => {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<TerminalLine[]>([
    { text: "Welcome!", isCommand: false },
    { text: 'Type "help" to see available commands', isCommand: false },
  ]);
  const [typing, setTyping] = useState<boolean>(false);
  const [typedText, setTypedText] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const endOfTerminalRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll logic
  useEffect(() => {
    endOfTerminalRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output, typedText]);

  // Unified Command Processor
  const executeCommand = (cmd: string) => {
    const rawInput = cmd.toLowerCase().trim();

    if (rawInput === "clear") {
      setOutput([]);
      if (onProjectSelect) onProjectSelect(null);
      return;
    }

    let newOutput: TerminalLine[] = [...output, { text: cmd, isCommand: true }];

    if (rawInput.startsWith("project ")) {
      const id = rawInput.split(" ")[1];
      const project = PROJECTS.find((p) => p.id === id);

      if (project) {
        // Trigger image in Header
        if (onProjectSelect) onProjectSelect(project.image);

        newOutput.push({
          text: `> Opening ${project.name} Visuals...`,
          isCommand: false,
        });
        project.details.forEach((line) =>
          newOutput.push({ text: line, isCommand: false }),
        );
      } else {
        newOutput.push({ text: `Project ${id} not found.`, isCommand: false });
      }
    } else {
      // Hide image for non-project commands
      if (onProjectSelect) onProjectSelect(null);

      if (commands[rawInput]) {
        const result = commands[rawInput]();
        result.forEach((line) =>
          newOutput.push({ text: line, isCommand: false }),
        );
      } else if (rawInput !== "") {
        newOutput.push({
          text: `Command not found: ${rawInput}`,
          isCommand: false,
        });
      }
    }

    setOutput(newOutput);
  };

  // Keyboard Traversal and Selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If typing in input, let form handle Enter
      if (document.activeElement?.tagName === "INPUT" && e.key === "Enter")
        return;
      if (document.activeElement?.tagName === "INPUT" && input !== "") return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = (prev + 1) % PROJECTS.length;
          if (onProjectSelect) onProjectSelect(PROJECTS[next].image);
          return next;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = (prev - 1 + PROJECTS.length) % PROJECTS.length;
          if (onProjectSelect) onProjectSelect(PROJECTS[next].image);
          return next;
        });
      } else if (
        e.key === "Enter" &&
        document.activeElement?.tagName !== "INPUT"
      ) {
        executeCommand(`project ${PROJECTS[selectedIndex].id}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, onProjectSelect, output]);

  const commands: CommandSet = {
    help: () => [
      "Available commands:",
      '"about"    - Show about information',
      '"skills"   - List my technical skills',
      '"projects" - View my projects',
      '"contact"  - Get contact information',
      '"clear"    - Clear the terminal',
    ],
    about: () => [
      "Specialized in architecting autonomous systems that close the gap between raw data and local action.",
      "I don't just build interfaces; I design agentic workflows that solve complex business logic.",
      "My edge: Combining deep-stack engineering with LLM orchestration to build self-correcting software.",
    ],
    skills: () => [
      <div key="1">
        <span className="font-bold text-blue-400">[01] Full-Stack:</span>{" "}
        Next.js • TypeScript • Node.js • PostgreSQL
      </div>,
      <div key="2">
        <span className="font-bold text-purple-400">[02] AI/Agents:</span> n8n •
        LangChain • RAG • VectorDBs
      </div>,
      <div key="3">
        <span className="font-bold text-green-400">[03] ML/Data:</span> Python •
        TensorFlow • XGBoost
      </div>,
      <div key="4">
        <span className="font-bold text-red-400">[04] DevOps:</span> Docker •
        Linux • CI/CD • AWS
      </div>,
      <div key="5">
        <span className="font-bold text-yellow-400">[05] Hardware:</span>{" "}
        Circuitry • Lighting Design
      </div>,
    ],
    projects: () => [
      "Featured Projects:",
      ...PROJECTS.map((p) => `${p.id}. ${p.name} - ${p.description}`),
      'Type "project [number]" or use Arrows + Enter',
    ],
    contact: (): CommandOutput => [
      "Contact Information:",
      "Email:ngashjoseph552@example.com",
      "phone number: 0742059454",
      <span key="github">
        GitHub:{" "}
        <a
          href="https://github.com/kaninijoseph"
          target="_blank"
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
          className="text-blue-400 hover:underline"
        >
          linkedin.com/in/kanini
        </a>
      </span>,
    ],
    clear: () => [],
  };

  // Typing effect logic
  useEffect(() => {
    const last = output[output.length - 1];
    if (last && !last.isCommand && typeof last.text === "string") {
      setTyping(true);
      setTypedText("");
      let index = 0;
      const text = last.text as string;
      const typeNext = () => {
        if (index <= text.length) {
          setTypedText(text.slice(0, index));
          index++;
          setTimeout(typeNext, 30);
        } else {
          setTyping(false);
        }
      };
      typeNext();
    } else {
      setTyping(false);
    }
  }, [output]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    executeCommand(input);
    setInput("");
  };

  return (
    <div className="w-full mt-1 h-full flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center bg-gray-900 px-4 py-2 border-b border-gray-700 w-full h-[5%] shrink-0">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="ml-4 text-gray-300 text-sm font-mono">Terminal</div>
      </div>

      <div className="bg-gray-800 rounded-b-lg shadow-xl overflow-hidden h-[95%]">
        <div
          className={`p-4 font-mono text-gray-100 h-full overflow-y-auto custom-scrollbar ${jetbrainsMono.className}`}
          style={{
            backgroundImage: `url(${terminalBg.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay",
            backgroundColor: "rgba(31, 41, 55, 0.9)",
          }}
        >
          {output.map((item, index) => {
            const isLastLine =
              index === output.length - 1 &&
              !item.isCommand &&
              typeof item.text === "string";
            return (
              <div
                key={index}
                className={
                  item.isCommand
                    ? "text-green-400 mb-2 font-bold"
                    : "text-gray-300 mb-2 pl-4"
                }
              >
                {item.isCommand
                  ? `@ng'ashjoseph/${item.text} ~$`
                  : isLastLine && typing
                    ? typedText
                    : item.text}
              </div>
            );
          })}
          <div ref={endOfTerminalRef} />
          <form onSubmit={handleSubmit} className="mt-2 flex">
            <span className="text-green-400 whitespace-nowrap mr-2">
              @ng'ashjoseph ~$
            </span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-transparent border-none outline-none text-gray-100 flex-grow"
              autoFocus
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
