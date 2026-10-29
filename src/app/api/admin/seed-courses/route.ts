import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const mainBranch = await prisma.branch.findFirst({ where: { isMain: true } });
    const branchId = mainBranch?.id || null;

    const coursesData = [
      {
        code: "FS-WEB-2026",
        title: "Full Stack Web Development (MERN & Next.js)",
        slug: "full-stack-web-development",
        category: "CODING",
        shortDesc: "End-to-end full stack software engineering with React, Next.js, Node.js, Express, PostgreSQL, Prisma, REST & GraphQL APIs, and Docker cloud deployment.",
        description: "Master modern enterprise web application development. Learn React 19, Next.js 15 App Router, TypeScript, server-side Node.js, microservices architecture, relational databases (PostgreSQL), NoSQL (MongoDB), Redis caching, cloud containerization with Docker, and CI/CD pipelines. Includes 4 industry-grade portfolio capstone projects.",
        duration: "6 Months (24 Weeks)",
        eligibility: "Graduates / Engineering / BCA / MCA / High School with basic programming knowledge",
        syllabus: [
          "Module 1: Modern HTML5, Advanced CSS3, Tailwind CSS & Responsive UI/UX",
          "Module 2: Deep JavaScript (ES6+), Asynchronous Event Loop & TypeScript Architecture",
          "Module 3: React 19, Server Components, Hooks, State Management & Next.js 15 App Router",
          "Module 4: Backend Engineering with Node.js, Express.js, REST APIs & GraphQL",
          "Module 5: Relational Database Architecture with PostgreSQL, Prisma ORM & Supabase",
          "Module 6: Authentication (JWT/OAuth), Security, Docker Containers & Cloud Deployment"
        ],
        baseFee: 45000,
        registrationFee: 1000,
        admissionFee: 3000,
        studyMatFee: 4000,
        examFee: 2000,
        gstPercent: 18,
        capacity: 60,
        facultySummary: "Senior Full Stack Engineers & Industry Architects",
        feeItems: [
          { name: "Full Stack Tuition & Mentor Lab Access", category: "TUITION", amount: 45000, frequency: "INSTALLMENT" },
          { name: "Online Student Registration & LMS Access", category: "REGISTRATION", amount: 1000, frequency: "ONE_TIME" },
          { name: "Academic Admission & Enrollment Kit", category: "ADMISSION", amount: 3000, frequency: "ONE_TIME" },
          { name: "Cloud Server Sandbox & Study Repositories", category: "STUDY_MATERIAL", amount: 4000, frequency: "ONE_TIME" },
          { name: "Capstone Project Assessment & Certification", category: "EXAM", amount: 2000, frequency: "ONE_TIME" }
        ],
        batches: [
          {
            code: "FS-26-WKD-A",
            name: "Weekend Full Stack Master Batch",
            startDate: "2026-11-15",
            endDate: "2027-05-15",
            days: "Saturday & Sunday",
            timing: "10:00 AM - 02:00 PM",
            mode: "HYBRID",
            room: "Lab 301 / Live Zoom Interactive",
            maxCapacity: 30
          },
          {
            code: "FS-26-EVE-B",
            name: "Weekday Evening Pro Batch",
            startDate: "2026-11-20",
            endDate: "2027-05-20",
            days: "Mon, Wed, Fri",
            timing: "07:00 PM - 09:30 PM",
            mode: "ONLINE",
            room: "Live Interactive Virtual Classroom",
            maxCapacity: 30
          }
        ]
      },
      {
        code: "FE-DEV-2026",
        title: "Frontend Web Development (React & Next.js Specialist)",
        slug: "frontend-development",
        category: "CODING",
        shortDesc: "Specialized modern frontend engineering covering HTML5, Tailwind CSS, JavaScript ES6+, React 19, Next.js App Router, and responsive web performance.",
        description: "Become a job-ready Frontend Engineer. Build fluid, high-performance web applications using modern React, Next.js, TypeScript, and state management. Master modern component systems, design systems, Web Vitals, API integration, and headless CMS implementations.",
        duration: "4 Months (16 Weeks)",
        eligibility: "Class 12 / College Students / Beginners passionate about web design and UI",
        syllabus: [
          "Module 1: Semantic HTML5, CSS Grid, Flexbox, Tailwind CSS & Responsive Layouts",
          "Module 2: JavaScript Mastery (DOM, Fetch, Promises, ESNext, TypeScript Basics)",
          "Module 3: React Core & Advanced Hooks (useMemo, useCallback, Custom Hooks)",
          "Module 4: Next.js 15 Framework (Routing, SSR, SSG, Server Actions & Metadata)",
          "Module 5: Client State Management (Zustand / Redux Toolkit) & Form Validation",
          "Module 6: Frontend Performance Optimization, Testing (Jest/RTL) & Vercel Deployment"
        ],
        baseFee: 28000,
        registrationFee: 1000,
        admissionFee: 2000,
        studyMatFee: 3000,
        examFee: 1500,
        gstPercent: 18,
        capacity: 50,
        facultySummary: "Lead UI/UX Developers & React Specialists",
        feeItems: [
          { name: "Frontend Tuition & Component Lab Mentorship", category: "TUITION", amount: 28000, frequency: "INSTALLMENT" },
          { name: "Registration & Student Portal Onboarding", category: "REGISTRATION", amount: 1000, frequency: "ONE_TIME" },
          { name: "Admission & Digital Portfolio Kit", category: "ADMISSION", amount: 2000, frequency: "ONE_TIME" },
          { name: "UI Design Systems & Project Guides", category: "STUDY_MATERIAL", amount: 3000, frequency: "ONE_TIME" },
          { name: "Frontend Project Evaluation & Certificate", category: "EXAM", amount: 1500, frequency: "ONE_TIME" }
        ],
        batches: [
          {
            code: "FE-26-MOR-A",
            name: "Morning Frontend Intensive Batch",
            startDate: "2026-11-10",
            endDate: "2027-03-10",
            days: "Mon to Fri",
            timing: "09:00 AM - 11:00 AM",
            mode: "OFFLINE",
            room: "Campus Lab 102",
            maxCapacity: 25
          },
          {
            code: "FE-26-EVE-B",
            name: "Evening Frontend Fastrack Batch",
            startDate: "2026-11-18",
            endDate: "2027-03-18",
            days: "Tue, Thu, Sat",
            timing: "06:00 PM - 08:30 PM",
            mode: "HYBRID",
            room: "Lab 204 / Hybrid Studio",
            maxCapacity: 25
          }
        ]
      },
      {
        code: "BE-DEV-2026",
        title: "Backend Development (Node.js, Databases & Microservices)",
        slug: "backend-development",
        category: "CODING",
        shortDesc: "Enterprise server-side architecture, REST & GraphQL APIs, Node.js, Express, NestJS, PostgreSQL, Redis caching, and microservices security.",
        description: "Master scalable server-side systems and infrastructure. Build secure, resilient APIs and backend services from scratch. Deep dive into database modeling, transactions, query optimization, caching strategies, message queues, rate limiting, and cloud DevOps.",
        duration: "4 Months (16 Weeks)",
        eligibility: "Graduates / Working Professionals with foundational JavaScript/Python knowledge",
        syllabus: [
          "Module 1: Node.js Internals, Event-Driven Architecture & Streams",
          "Module 2: RESTful API Design, Express.js Middleware & MVC Architecture",
          "Module 3: Relational DB Modeling (PostgreSQL, Indexing, Transactions & Prisma ORM)",
          "Module 4: NoSQL Databases (MongoDB, Redis in-memory caching & session stores)",
          "Module 5: Security Architecture (JWT, OAuth2, Rate Limiting, CORS, OWASP guidelines)",
          "Module 6: Microservices, Message Queues (RabbitMQ/Kafka) & Cloud Deployment"
        ],
        baseFee: 30000,
        registrationFee: 1000,
        admissionFee: 2500,
        studyMatFee: 3500,
        examFee: 1500,
        gstPercent: 18,
        capacity: 50,
        facultySummary: "Principal Backend Architects & DevOps Engineers",
        feeItems: [
          { name: "Backend Architecture Tuition & Cloud Sandbox", category: "TUITION", amount: 30000, frequency: "INSTALLMENT" },
          { name: "Registration & Student Portal Access", category: "REGISTRATION", amount: 1000, frequency: "ONE_TIME" },
          { name: "Academic Admission & Architecture Kit", category: "ADMISSION", amount: 2500, frequency: "ONE_TIME" },
          { name: "Database & Cloud Cluster Lab Credits", category: "STUDY_MATERIAL", amount: 3500, frequency: "ONE_TIME" },
          { name: "System Design Evaluation & Certification", category: "EXAM", amount: 1500, frequency: "ONE_TIME" }
        ],
        batches: [
          {
            code: "BE-26-WKD-A",
            name: "Weekend Backend Architecture Batch",
            startDate: "2026-11-15",
            endDate: "2027-03-15",
            days: "Saturday & Sunday",
            timing: "02:30 PM - 06:30 PM",
            mode: "HYBRID",
            room: "Systems Lab 305 / Zoom",
            maxCapacity: 25
          },
          {
            code: "BE-26-EVE-B",
            name: "Weekday Evening Backend Pro Batch",
            startDate: "2026-11-20",
            endDate: "2027-03-20",
            days: "Mon, Wed, Fri",
            timing: "07:30 PM - 09:45 PM",
            mode: "ONLINE",
            room: "Virtual Server Engineering Lab",
            maxCapacity: 25
          }
        ]
      },
      {
        code: "ROBO-STEM-2026",
        title: "STEM Education & Robotics (Arduino, IoT & Embedded AI)",
        slug: "stem-education-robotics",
        category: "ROBOTICS",
        shortDesc: "Hands-on robotics, IoT systems, Arduino & Raspberry Pi hardware, embedded programming in C++/Python, sensors, and autonomous robot building.",
        description: "An experiential, laboratory-driven program designed to develop practical engineering and innovation skills. Students build real robots from scratch, program microcontrollers, interface optical/ultrasonic/thermal sensors, design motor drive circuits, and build wireless IoT devices with embedded AI vision.",
        duration: "6 Months (24 Weeks)",
        eligibility: "School Students (Classes 6-12) & Undergraduate Tech Enthusiasts",
        syllabus: [
          "Module 1: Fundamentals of Electronics, Circuit Prototyping & Soldering Safety",
          "Module 2: Arduino Microcontroller Architecture & Embedded C/C++ Programming",
          "Module 3: Sensor Interfacing (Ultrasonic, IR, Gyro, Temperature) & Motor Controllers",
          "Module 4: Autonomous Line-Follower & Obstacle-Avoiding Robotic Vehicles",
          "Module 5: Internet of Things (IoT) with ESP32 & Cloud Telemetry Dashboards",
          "Module 6: Raspberry Pi, Python for Hardware & AI Computer Vision Project"
        ],
        baseFee: 35000,
        registrationFee: 1000,
        admissionFee: 3000,
        studyMatFee: 8000,
        examFee: 2000,
        gstPercent: 18,
        capacity: 40,
        facultySummary: "Robotics Engineers & Embedded Systems Mentors",
        feeItems: [
          { name: "Robotics Laboratory Tuition & Hardware Mentorship", category: "TUITION", amount: 35000, frequency: "INSTALLMENT" },
          { name: "Student Lab Registration & Portal Membership", category: "REGISTRATION", amount: 1000, frequency: "ONE_TIME" },
          { name: "Robotics Society Admission & Safety Certification", category: "ADMISSION", amount: 3000, frequency: "ONE_TIME" },
          { name: "Personal Hardware Robotics Toolkit & Sensors Kit", category: "STUDY_MATERIAL", amount: 8000, frequency: "ONE_TIME" },
          { name: "Competition Entry, Robot Arena & Certification", category: "EXAM", amount: 2000, frequency: "ONE_TIME" }
        ],
        batches: [
          {
            code: "ROBO-26-SAT-A",
            name: "Junior Robotics Innovators Batch",
            startDate: "2026-11-15",
            endDate: "2027-05-15",
            days: "Every Saturday",
            timing: "10:00 AM - 02:00 PM",
            mode: "OFFLINE",
            room: "Robotics Arena & Maker Lab (Block A)",
            maxCapacity: 20
          },
          {
            code: "ROBO-26-SUN-B",
            name: "Advanced IoT & Autonomous Robots Lab",
            startDate: "2026-11-16",
            endDate: "2027-05-16",
            days: "Every Sunday",
            timing: "10:00 AM - 02:00 PM",
            mode: "OFFLINE",
            room: "Advanced Embedded Systems Lab (Block B)",
            maxCapacity: 20
          }
        ]
      }
    ];

    const results = [];

    for (const c of coursesData) {
      const course = await prisma.course.upsert({
        where: { code: c.code },
        update: {
          title: c.title,
          slug: c.slug,
          category: c.category,
          shortDesc: c.shortDesc,
          description: c.description,
          duration: c.duration,
          eligibility: c.eligibility,
          syllabusJson: JSON.stringify(c.syllabus),
          baseFee: c.baseFee,
          registrationFee: c.registrationFee,
          admissionFee: c.admissionFee,
          studyMatFee: c.studyMatFee,
          examFee: c.examFee,
          gstPercent: c.gstPercent,
          capacity: c.capacity,
          facultySummary: c.facultySummary,
          status: "ACTIVE",
          featured: true,
          branchId
        },
        create: {
          code: c.code,
          title: c.title,
          slug: c.slug,
          category: c.category,
          shortDesc: c.shortDesc,
          description: c.description,
          duration: c.duration,
          eligibility: c.eligibility,
          syllabusJson: JSON.stringify(c.syllabus),
          baseFee: c.baseFee,
          registrationFee: c.registrationFee,
          admissionFee: c.admissionFee,
          studyMatFee: c.studyMatFee,
          examFee: c.examFee,
          gstPercent: c.gstPercent,
          capacity: c.capacity,
          facultySummary: c.facultySummary,
          status: "ACTIVE",
          featured: true,
          branchId
        }
      });

      // Seed Fee Items
      await prisma.feeStructure.deleteMany({ where: { courseId: course.id } });
      await prisma.feeStructure.createMany({
        data: c.feeItems.map((item) => ({
          courseId: course.id,
          name: item.name,
          category: item.category,
          amount: item.amount,
          frequency: item.frequency,
          gstPercent: c.gstPercent,
          isMandatory: true
        }))
      });

      // Seed Batches
      for (const b of c.batches) {
        await prisma.batch.upsert({
          where: { code: b.code },
          update: {
            name: b.name,
            courseId: course.id,
            startDate: b.startDate,
            endDate: b.endDate,
            days: b.days,
            timing: b.timing,
            mode: b.mode,
            room: b.room,
            maxCapacity: b.maxCapacity,
            status: "ACTIVE",
            branchId
          },
          create: {
            code: b.code,
            name: b.name,
            courseId: course.id,
            startDate: b.startDate,
            endDate: b.endDate,
            days: b.days,
            timing: b.timing,
            mode: b.mode,
            room: b.room,
            maxCapacity: b.maxCapacity,
            status: "ACTIVE",
            branchId
          }
        });
      }

      results.push({ code: course.code, title: course.title, fee: course.baseFee });
    }

    return NextResponse.json({
      success: true,
      message: "Seeded all requested courses, fee structures, and batches successfully!",
      seededCourses: results
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

