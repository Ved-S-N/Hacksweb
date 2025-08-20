# HackHost

**Hackathon Event Platform** — Create and manage hackathon events, streamline team formation, project submissions, judging, and communication—all in one place.

---

##  Overview

HackHost is a hackathon management platform built during a hackathon sprint. It enables:

- **Event creation & management** (tracks, rules, timeline, sponsors)
- **User registration & team formation** (email authentication, team invites)
- **Project submissions & multi-round judging**
- **Real-time communication** (announcements, Q&A)
- **Role-based dashboards** for participants, organizers, and judges

Built as an MVP with future scalability in mind, with a strong backend schema and clear architecture.

---

##  Tech Stack

- **Backend**: Node.js, Express, Prisma ORM  
- **Database**: Azure SQL (structured data), MongoDB (unstructured data like chat/announcements)  
- **Cloud**: Azure (Web App, Functions, Blob Storage)  
- **Frontend**: React / Next.js  
- **Auth**: JSON Web Tokens (JWT) with role-based access control  
- **Deployment**: Hosted on Azure Web App (or placeholder)

---

##  Demo Screenshot

*(Add a screenshot or GIF here to visually demonstrate the UI—for example: event dashboard or submission flow.)*

---

##  Getting Started

### Prerequisites
- Node.js (v16+)
- Access to Azure SQL and optionally MongoDB
- `DATABASE_URL`, `JWT_SECRET`, and other necessary env variables configured in `.env`

### Installation
```bash
git clone https://github.com/Ved-S-N/HackHost.git
cd HackHost/backend
npm install


 Start backend API server
npx prisma migrate deploy
npm run dev

# Start frontend (in separate terminal)
cd ../frontend
npm install && npm run dev
