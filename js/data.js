/**
 * data.js — Central content file for Abdul Moeed's portfolio.
 * Edit this file to update projects, skills, experience, and contact info.
 */

// ─── PERSONAL INFO ────────────────────────────────────────────────────────────
const PERSONAL = {
  name: "Abdul Moeed",
  title: "AI & Software Engineer",
  tagline: "Building intelligent software that turns ideas into impact.",
  email: "Moeedsethi21@gmail.com",
  phone: "+92-335-6565297",
  linkedin: "https://linkedin.com/in/abdul-moeed21",
  github: "https://github.com/moeedsethi",
  cv: "#", // Replace with actual CV link
  avatar: null, // Replace with image path if desired
};

// ─── ABOUT ────────────────────────────────────────────────────────────────────
const ABOUT = {
  paragraphs: [
    "I'm a Computer Science graduate (Class of 2026) who genuinely enjoys writing code and building things that work well in the real world. Over the past few years, I've focused on full-stack web applications and practical AI integrations—from forecasting crop prices for farmers across Pakistan to building LLM pipelines that help stress-test ideas.",
    "My day-to-day stack revolves around Python, Django, React, and PostgreSQL, alongside data analysis and automation tools like Pandas and Selenium. I value clean architecture, straightforward communication, and building reliable software that delivers real value.",
  ],
  stats: [
    { label: "Projects Shipped", value: "3+" },
    { label: "Years Coding", value: "3+" },
    { label: "Graduation", value: "2026" },
  ],
};

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: "agribazaar",
    title: "AgriBazaar",
    emoji: "🌾",
    tagline: "AI-powered agricultural marketplace",
    description:
      "A Django marketplace connecting farmers and buyers across Pakistan, featuring AI-driven crop price forecasting and live weather API integration to help farmers make data-informed decisions.",
    tech: ["Python", "Django", "PostgreSQL", "Pandas", "NumPy"],
    highlights: [
      "AI-driven crop price forecasting engine",
      "Live weather API integration",
      "Farmer ↔ Buyer direct marketplace",
      "Pakistan-wide coverage",
    ],
    github: "#", // Add actual link
    live: "#",   // Add actual link
    color: "#22c55e", // green accent
    colorDark: "#15803d",
  },
  {
    id: "pocketmind",
    title: "Pocket Mind",
    emoji: "🧠",
    tagline: "LLM pipeline for idea clarity",
    description:
      "An AI voice app that runs raw ideas through an LLM pipeline to automatically flag hidden assumptions, logical gaps, and potential risks — helping thinkers sharpen their thinking before acting.",
    tech: ["Python", "Django", "React", "Celery", "PostgreSQL"],
    highlights: [
      "Voice-to-idea LLM pipeline",
      "Assumption & risk detection",
      "Async task processing with Celery",
      "Full-stack React + Django",
    ],
    github: "#", // Add actual link
    live: "#",   // Add actual link
    color: "#8b5cf6", // violet accent
    colorDark: "#6d28d9",
  },
  {
    id: "mapleads",
    title: "MapLeads",
    emoji: "📍",
    tagline: "Google Maps lead automation",
    description:
      "An automation tool that scrapes Google Maps business data, exports structured CSVs, and generates personalized cold emails using an AI chatbot — streamlining outbound lead generation.",
    tech: ["Python", "Selenium", "Pandas"],
    highlights: [
      "Automated Google Maps scraping",
      "Structured CSV export",
      "AI-generated personalized cold emails",
      "Built-in AI chatbot assistant",
    ],
    github: "#", // Add actual link
    live: "#",   // Add actual link
    color: "#3b82f6", // blue accent
    colorDark: "#1d4ed8",
  },
];

// ─── SKILLS ───────────────────────────────────────────────────────────────────
const SKILLS = {
  Languages: [
    { name: "Python", level: 90 },
    { name: "JavaScript", level: 75 },
    { name: "SQL", level: 75 },
    { name: "HTML/CSS", level: 80 },
    { name: "C++", level: 60 },
  ],
  Frameworks: [
    { name: "Django", level: 85 },
    { name: "React", level: 70 },
    { name: "REST APIs", level: 80 },
    { name: "Celery", level: 65 },
  ],
  "AI & Data": [
    { name: "LLMs / OpenAI", level: 80 },
    { name: "Pandas", level: 80 },
    { name: "NumPy", level: 75 },
    { name: "Data Analysis", level: 75 },
    { name: "Selenium", level: 70 },
  ],
  Databases: [
    { name: "PostgreSQL", level: 75 },
    { name: "MySQL", level: 65 },
    { name: "SQLite", level: 70 },
  ],
  Tools: [
    { name: "Git / GitHub", level: 80 },
    { name: "Vercel", level: 70 },
    { name: "VS Code", level: 90 },
    { name: "Linux", level: 65 },
    { name: "Postman", level: 70 },
  ],
};

// ─── EXPERIENCE ───────────────────────────────────────────────────────────────
const EXPERIENCE = [
  {
    role: "Data Analyst",
    company: "TechByte Solutions",
    period: "Oct 2025 – Apr 2026",
    type: "Full-time",
    icon: "📊",
    bullets: [
      "Analyzed and interpreted complex datasets to surface actionable business insights.",
      "Built data pipelines and dashboards to track key performance indicators.",
      "Collaborated with cross-functional teams to deliver data-driven recommendations.",
    ],
    color: "#3b82f6",
  },
  {
    role: "Freelance Web Developer",
    company: "Self-employed",
    period: "2023 – Present",
    type: "Freelance",
    icon: "💻",
    bullets: [
      "Designed and deployed full-stack web applications for clients across multiple industries.",
      "Built Django backends with REST APIs consumed by React frontends.",
      "Delivered AI-integrated features including LLM pipelines and automation scripts.",
    ],
    color: "#8b5cf6",
  },
];
