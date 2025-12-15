"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { Mail, Linkedin, Github } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" })
      setIsSubmitted(false)
    }, 3000)
  }

  const socialLinks = [
    {
      icon: Mail,
      label: "Email",
      href: "mailto:vanshsinhaacademics@gmail.com",
      display: "vanshsinhaacademics@gmail.com",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/vanshsinha/",
      display: "linkedin.com/in/vanshsinha",
    },
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/vanshsinhaa",
      display: "github.com/vanshsinhaa",
    },
  ]

  return (
    <div className="container mx-auto max-w-4xl px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-favorit font-normal text-5xl tracking-tight md:text-6xl">Get in Touch</h1>
        <p className="mt-6 text-xl text-muted-foreground leading-relaxed font-geist">
          I'm always open to discussing new projects, interesting ideas, or opportunities to collaborate.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-12 md:grid-cols-2">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="font-favorit font-normal text-2xl">Send a Message</h2>
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground">
                Name
              </label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-2"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-2"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground">
                Message
              </label>
              <Textarea
                id="message"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="mt-2 min-h-32"
                placeholder="Tell me about your project or idea..."
              />
            </div>

            <Button type="submit" className="w-full bg-[#3b0dd4] text-white hover:bg-[#2a0ba0] shadow-lg shadow-[#3b0dd4]/20 hover:shadow-[#3b0dd4]/40 transition-all" disabled={isSubmitting || isSubmitted}>
              {isSubmitting ? "Sending..." : isSubmitted ? "Message Sent!" : "Send Message"}
            </Button>
          </form>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="font-favorit font-normal text-2xl">Connect</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Prefer a different way to connect? Find me on these platforms or send me an email directly.
          </p>

          <div className="mt-8 space-y-4">
            {socialLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  target={link.label !== "Email" ? "_blank" : undefined}
                  rel={link.label !== "Email" ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:border-[#3b0dd4]/40 hover:shadow-lg hover:shadow-[#3b0dd4]/10"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{link.label}</p>
                    <p className="text-sm text-muted-foreground">{link.display}</p>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="mt-8 rounded-lg border border-border bg-muted/30 p-6">
            <h3 className="font-favorit font-normal text-lg">Availability</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Currently open to freelance projects and consulting opportunities. I typically respond within 24-48 hours.
            </p>
          </div>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-16"
      >
        <h2 className="font-favorit font-normal text-2xl">Common Questions</h2>
        <div className="mt-8 space-y-6">
          <div className="border-l-2 border-[#3b0dd4]/30 pl-6">
            <h3 className="font-favorit font-normal text-lg">What type of projects do you work on?</h3>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              I specialize in data engineering, cloud infrastructure, and full-stack web applications. I love building websites and bringing ideas to life—whether it's real-time data processing, scalable systems, or polished web experiences.
            </p>
          </div>
          <div className="border-l-2 border-[#3b0dd4]/30 pl-6">
            <h3 className="font-favorit font-normal text-lg">Are you available for consulting?</h3>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              Yes! I offer consulting for data pipeline architecture, system design reviews, and technical audits. Reach
              out to discuss your specific needs.
            </p>
          </div>
          <div className="border-l-2 border-[#3b0dd4]/30 pl-6">
            <h3 className="font-favorit font-normal text-lg">Do you write technical content?</h3>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              I occasionally write about data engineering, infrastructure, and developer experience. Check out my
              writing section for recent posts, or reach out if you'd like me to write something specific.
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
