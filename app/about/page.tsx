"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function AboutPage() {
  const experience = [
    {
      role: "Software Engineering Intern",
      company: "American Express",
      period: "May 2025 — Aug 2025",
      description:
        "Incoming Software Engineering Intern for Summer 2025.",
      upcoming: true,
    },
    {
      role: "Software Engineering Intern",
      company: "Wimoku",
      period: "June 2025 — Present",
      description:
        "Built metadata-driven BigQuery query rerun manager using Docker and Kubernetes. Orchestrated 500+ SQL queries daily for batch analytics. Created documentation detailing architecture, deployment strategies, and onboarding guides to accelerate new user adoption.",
    },
    {
      role: "Freelance Web Designer",
      company: "Self-Employed",
      period: "Jan 2024 — Present",
      description:
        "Applied user research and competitive analysis to drive design. Applied SEO best practices: boosting organic user retention by 30%. Built polished UI/UX with React, Next.js, Tailwind, and database integrations, including secure payment flows and email notification systems.",
    },
  ]

  const skills = [
    { category: "Languages", items: ["Python", "Java", "C/C++", "SQL", "JavaScript", "HTML/CSS"] },
    { category: "Frameworks & Libraries", items: ["React", "Next.js", "FastAPI", "Node.js", "Tailwind", "pandas", "NumPy", "MapReduce", "Apache"] },
    { category: "Tools & Platforms", items: ["Git", "GCP", "Docker", "Kubernetes", "Heroku", "VS Code", "PyCharm", "IntelliJ", "Stripe API"] },
  ]

  return (
    <div className="container mx-auto max-w-4xl px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-5xl font-normal tracking-tight md:text-6xl lg:text-7xl">About</h1>
        <p className="mt-6 text-xl md:text-2xl text-muted-foreground leading-relaxed">
          I'm a data engineer and full-stack developer who loves building systems that scale.
        </p>
      </motion.div>

      {/* Bio */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-16"
      >
        <h2 className="text-3xl font-normal md:text-4xl">Background</h2>
        <div className="mt-6 space-y-4 text-base md:text-lg leading-relaxed text-muted-foreground">
          <p>
            I'm a Computer Science student at Arizona State University (graduating May 2027) with a minor in Data Science. 
            I specialize in building data infrastructure and full-stack applications that scale. My work focuses on the 
            intersection of data engineering, cloud infrastructure, and developer experience.
          </p>
          <p>
            I believe in writing simple, maintainable code and building systems that are easy to operate. Good
            observability isn't optional—it's how you sleep well at night when you're running production systems.
          </p>
          <p>
            When I'm not coding, you'll find me competing in hackathons (top 10% twice at HackerDevils), working with 
            AI communities, or exploring new technologies and frameworks.
          </p>
        </div>
      </motion.section>

      {/* Experience */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-16"
      >
        <h2 className="text-3xl font-normal md:text-4xl">Experience</h2>
        <div className="mt-8 space-y-8">
          {experience.map((job, index) => (
            <div key={index} className="border-l-2 border-border pl-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-normal md:text-2xl">{job.role}</h3>
                  {job.upcoming && (
                    <span className="rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                      Upcoming
                    </span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">{job.period}</span>
              </div>
              <div className="mt-1 flex items-center gap-3">
                {job.company === "American Express" && (
                  <Image
                    src="/American_Express-Logo.wine.svg"
                    alt="American Express Logo"
                    width={80}
                    height={24}
                    className="h-6 w-auto"
                  />
                )}
                <p className="font-medium text-muted-foreground">{job.company}</p>
              </div>
              <p className="mt-3 leading-relaxed text-muted-foreground">{job.description}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Leadership & Activities */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-16"
      >
        <h2 className="text-3xl font-normal md:text-4xl">Leadership & Activities</h2>
        <div className="mt-8 space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-xl font-normal">Hacker Devils, ASU</h3>
              <span className="text-sm text-muted-foreground">Aug 2023 — Present</span>
            </div>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Competed in coding competitions, placing in top 10% twice. Attended workshops on AI/ML, cloud, and algorithms.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-xl font-normal">AI Maker Space</h3>
              <span className="text-sm text-muted-foreground">Aug 2024 — Present</span>
            </div>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Worked on AI Maker Space building applications with peers. Learned ML fundamentals, NLP, and Retrieval-Augmented Generation (RAG).
            </p>
          </div>
        </div>
      </motion.section>

      {/* Skills */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-16"
      >
        <h2 className="text-3xl font-normal md:text-4xl">Skills & Tools</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {skills.map((skillGroup) => (
            <div key={skillGroup.category} className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-medium uppercase tracking-widest text-muted-foreground text-xs">
                {skillGroup.category}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {skillGroup.items.map((skill) => (
                  <span key={skill} className="rounded-md bg-muted px-3 py-1 text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

    </div>
  )
}
