import { ReactNode } from "react";

export interface Project {
  id: string;
  name: string;
  image: string;
  description: string;
  details: ReactNode[];
}

export const PROJECTS: Project[] = [
  {
    id: "1",
    name: "EventPulse",
    image: "/eventpulsee.png",
    description: "Geolocation event recomendation engine",
    details: [
      "EventPulse: Predictive Discovery System",
      "• Developed a recommendation algorithm using collaborative filtering.",
      ". The model uses location to match users to events closer to them.",
      "• Engineered a 'Pulse Engine' for real-time event tracking in Nairobi.",
      "• Tech: Next.js, Express, Python, and Pinecone Vector DB.",
    ],
  },
  {
    id: "2",
    name: "CSK Website",
    image: "/csk.png",
    description: "Computer Society of Kirinyaga - Tech Community Platform",
    details: [
      "Computer Society of Kirinyaga (CSK):",
      "• Organized and branded info sessions for 2025/2026 academic year.",
      "• Developed student outreach strategies and technical ML/AI tracks.",
      "• Lead community-driven sessions for developer growth.",
    ],
  },
];
