export type BlogBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "code"; code: string }
  | { type: "quote"; text: string };

export interface BlogPost {
  slug: string;
  category: string;
  title: string;
  subtitle: string;
  date: string;
  readingTime: string;
  excerpt: string;
  /** CSS background for the post cover — layered radial gradients, no images to load */
  gradient: string;
  /** Accent color used for hover glows and shadows */
  glow: string;
  content: BlogBlock[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "building-savemygrade",
    category: "Engineering & Design",
    title: "Building SaveMyGrade: A Living Brain for University",
    subtitle: "thoughts on retrieval, memory, and local-first AI",
    date: "2026-07-14",
    readingTime: "8 min read",
    excerpt:
      "Most students don't have a note-taking problem — they have a fragmentation problem. What happens when every piece of academic information enters the same system?",
    gradient:
      "radial-gradient(110% 90% at 15% 20%, rgba(110, 231, 183, 0.85) 0%, rgba(110, 231, 183, 0) 55%), radial-gradient(90% 80% at 85% 14%, rgba(94, 234, 212, 0.7) 0%, rgba(94, 234, 212, 0) 55%), radial-gradient(110% 110% at 75% 90%, rgba(196, 181, 253, 0.6) 0%, rgba(196, 181, 253, 0) 62%), linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 100%)",
    glow: "rgba(52, 211, 153, 0.28)",
    content: [
      { type: "paragraph", text: "Most students don't have a note-taking problem." },
      { type: "paragraph", text: "They have a fragmentation problem." },
      {
        type: "paragraph",
        text: "By the middle of a semester, course material ends up scattered across dozens of places:",
      },
      {
        type: "list",
        items: [
          "lecture slides",
          "PDFs",
          "recorded lectures",
          "screenshots",
          "YouTube videos",
          "ChatGPT conversations",
          "Google Docs",
          "Notion pages",
          "random browser tabs you'll definitely come back to later",
        ],
      },
      {
        type: "paragraph",
        text: "When it comes time to study, finding information becomes harder than understanding it. The modern student has effectively become their own search engine.",
      },
      { type: "paragraph", text: "SaveMyGrade started from a simple observation:" },
      {
        type: "quote",
        text: "What if every piece of academic information entered the same system?",
      },
      {
        type: "paragraph",
        text: "Not your notes in one place. Not your PDFs in another. Not your AI conversations somewhere else.",
      },
      { type: "paragraph", text: "Everything." },
      {
        type: "paragraph",
        text: "The goal wasn't to build another study application. The goal was to build a living academic memory.",
      },

      { type: "heading", text: "The Product Philosophy" },
      {
        type: "paragraph",
        text: "The workflow for most students today looks something like this:",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Download lecture slides.",
          "Upload them to ChatGPT.",
          "Ask questions.",
          "Close the conversation.",
          "Repeat next week.",
        ],
      },
      {
        type: "paragraph",
        text: "The context disappears. The model forgets. You start over.",
      },
      { type: "paragraph", text: "Every single time." },
      {
        type: "paragraph",
        text: "SaveMyGrade takes the opposite approach. Every PDF, video, image, lecture recording, and note becomes part of a continuously growing knowledge base.",
      },
      { type: "paragraph", text: "The system remembers." },
      {
        type: "paragraph",
        text: "By week twelve, the application understands twelve weeks of material. By finals week, your entire semester exists inside a searchable representation of your coursework. The more you use it, the more useful it becomes.",
      },
      {
        type: "paragraph",
        text: "The vision is simple: when you sit down to study, you open one application.",
      },
      {
        type: "paragraph",
        text: "Not Canvas. Not ChatGPT. Not Google Drive. Not Notion.",
      },
      {
        type: "paragraph",
        text: "Everything you consume while learning flows into the same place. A lecture recording becomes searchable. A screenshot becomes searchable. A whiteboard photo becomes searchable. A PDF from your professor becomes searchable.",
      },
      {
        type: "paragraph",
        text: "The application slowly becomes a second brain for the semester.",
      },

      { type: "heading", text: "Retrieval Ends Up Being the Product" },
      {
        type: "paragraph",
        text: "Most AI applications today optimize generation. Better prompts. Better models. Better outputs.",
      },
      { type: "paragraph", text: "I found that retrieval mattered far more." },
      {
        type: "paragraph",
        text: "The quality of an answer is largely determined before the language model generates a single token. Finding the right context became the core engineering problem.",
      },
      {
        type: "paragraph",
        text: "That led to a fairly traditional retrieval pipeline:",
      },
      {
        type: "code",
        code: "ingestion\n→ chunking\n→ embeddings\n→ vector search\n→ reranking\n→ generation\n→ citations",
      },
      {
        type: "paragraph",
        text: "The individual components are not new. The challenge is making the entire system behave reliably across many types of information.",
      },
      {
        type: "quote",
        text: "A good answer isn't produced by a smarter model. A good answer is produced by giving the model the right context.",
      },

      { type: "heading", text: "Building a Search Engine for Your Own Brain" },
      {
        type: "paragraph",
        text: "At its core, SaveMyGrade is less of an AI chatbot and more of a personal search engine.",
      },
      {
        type: "paragraph",
        text: "Every piece of information entering the system goes through an ingestion pipeline:",
      },
      {
        type: "list",
        items: [
          "content extraction",
          "chunking",
          "embedding generation",
          "metadata enrichment",
          "indexing",
        ],
      },
      {
        type: "paragraph",
        text: "The result is a vector representation of your semester. Instead of searching filenames or folders, you search concepts.",
      },
      {
        type: "paragraph",
        text: "You don't remember where you learned something. You remember what you learned. The system handles the rest.",
      },
      {
        type: "paragraph",
        text: "“Where was that slide about TCP congestion control?” becomes “Explain TCP congestion control and show me where I learned it.”",
      },
      {
        type: "paragraph",
        text: "That distinction ends up being surprisingly powerful.",
      },

      { type: "heading", text: "Multimodal Means More Than Images" },
      {
        type: "paragraph",
        text: "Most applications advertise multimodal support. Often this means an image receives an embedding vector and can be retrieved later.",
      },
      { type: "paragraph", text: "That isn't enough." },
      {
        type: "paragraph",
        text: "A photo of a whiteboard diagram should contribute to:",
      },
      {
        type: "list",
        items: [
          "chat answers",
          "flashcards",
          "summaries",
          "concept relationships",
          "knowledge graphs",
        ],
      },
      {
        type: "paragraph",
        text: "The system performs additional analysis during ingestion so that images become understandable context rather than binary files sitting in storage. The same applies to videos, diagrams, equations, and lecture screenshots.",
      },
      {
        type: "paragraph",
        text: "The objective is not storing media. It's extracting knowledge from media.",
      },

      { type: "heading", text: "Knowledge Graphs Were More Useful Than Expected" },
      {
        type: "paragraph",
        text: "One feature that surprised me was the knowledge graph.",
      },
      {
        type: "paragraph",
        text: "As information entered the system, concepts and relationships started emerging naturally:",
      },
      {
        type: "list",
        items: [
          "TCP relates to congestion control.",
          "Congestion control relates to packet loss.",
          "Packet loss relates to retransmission algorithms.",
        ],
      },
      {
        type: "paragraph",
        text: "The graph became less of a visualization feature and more of an explanation tool.",
      },
      {
        type: "paragraph",
        text: "Students rarely struggle because they don't know enough facts. They struggle because they don't understand how facts connect.",
      },
      {
        type: "paragraph",
        text: "Knowledge graphs turn isolated information into structure.",
      },

      { type: "heading", text: "Good Access To Data Matters" },
      {
        type: "paragraph",
        text: "Most AI products today treat your data as temporary context. Upload a file. Ask a question. Close the tab. Start over tomorrow.",
      },
      {
        type: "paragraph",
        text: "SaveMyGrade takes a different approach. Your data remains accessible, searchable, and reusable.",
      },
      {
        type: "paragraph",
        text: "Every note improves future retrieval. Every lecture strengthens future answers. Every upload makes the system more useful than it was yesterday.",
      },
      {
        type: "paragraph",
        text: "The application compounds in value over time because its memory compounds over time.",
      },

      { type: "heading", text: "Local-First AI Is Underrated" },
      {
        type: "paragraph",
        text: "Most AI applications immediately push user data into the cloud. SaveMyGrade takes a different approach: the entire application runs locally.",
      },
      { type: "paragraph", text: "Setup consists of:" },
      {
        type: "list",
        ordered: true,
        items: [
          "Clone the repository.",
          "Add a Gemini API key.",
          "Start the application.",
        ],
      },
      { type: "paragraph", text: "That's it." },
      {
        type: "paragraph",
        text: "No accounts. No subscriptions. No external databases. No cloud infrastructure.",
      },
      {
        type: "paragraph",
        text: "A free Gemini API key is enough to run the entire system.",
      },
      {
        type: "paragraph",
        text: "There is something refreshing about software that simply starts working after configuration instead of onboarding you through five SaaS dashboards.",
      },

      { type: "heading", text: "Building With AI Changes What Matters" },
      {
        type: "paragraph",
        text: "This project also became an experiment in modern software engineering.",
      },
      {
        type: "paragraph",
        text: "Implementation is becoming cheaper. Architecture isn't.",
      },
      {
        type: "paragraph",
        text: "Writing an endpoint is easy. Changing the ownership model of your data isn't. Building a component is easy. Discovering six different components solving the same problem isn't.",
      },
      {
        type: "paragraph",
        text: "The limiting factor increasingly feels less like code generation and more like maintaining conceptual integrity across an evolving system.",
      },
      {
        type: "paragraph",
        text: "That observation surprised me more than anything else during the project.",
      },

      { type: "heading", text: "Looking Forward" },
      {
        type: "paragraph",
        text: "The most exciting part about personal AI systems isn't generation. It's memory.",
      },
      {
        type: "paragraph",
        text: "Language models are becoming increasingly capable at reasoning. What they still lack is context.",
      },
      {
        type: "paragraph",
        text: "Your context. Your notes. Your lectures. Your projects. Your understanding of the world.",
      },
      {
        type: "paragraph",
        text: "SaveMyGrade is an attempt to bridge that gap.",
      },
      {
        type: "paragraph",
        text: "Not another chatbot. Not another notes app. Not another study platform.",
      },
      {
        type: "paragraph",
        text: "A living brain for everything you learn throughout a semester.",
      },
      {
        type: "paragraph",
        text: "And perhaps eventually, everything you learn beyond it.",
      },
    ],
  },
];

export function formatPostDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
