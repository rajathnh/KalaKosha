# KalaKosha - An AI-Guided Cultural Marketplace

**Live Demo:** [https://kala-kosha.vercel.app/](https://kala-kosha.vercel.app/)  
*(Please note: Backend is hosted on GCP's free tier, which may experience cold starts. The initial load could take up to 30 seconds.)*

**Submission for CodeFury 8.0 Hackathon**
**Theme:** Art and Culture

---

## 1. The Problem: A Fading Heritage

Traditional Indian folk art forms like Warli, Pithora, and Madhubani are invaluable cultural assets at risk of being forgotten. Local artists struggle with limited visibility and a lack of modern platforms to connect with a global audience. This digital divide prevents them from sustaining their livelihoods and puts our shared cultural heritage in jeopardy.

## 2. Our Solution: A Complete Digital Ecosystem

KalaKosha is a comprehensive, full-stack platform designed to be the definitive digital ecosystem for Indian folk art. We've gone beyond a simple marketplace to build a vibrant community hub that **preserves**, **promotes**, and **creates engagement**.

Our platform empowers artists to thrive in the digital age and makes their art accessible and understandable to a new generation of enthusiasts.

---

## 3. What Makes KalaKosha Unique?

We built a feature-rich platform that addresses every facet of the problem statement.

### For the Art Lover & Enthusiast:
*   **AI Art Concierge:** An innovative chatbot powered by Botpress, trained to educate users about different art forms, answer their questions, and guide them in discovering art. It also provides on-demand **export compliance** guidance for artists.
*   **Multi-Faceted Marketplace:** Discover and purchase authentic artworks, or enroll in courses to learn the techniques directly from master artists.
*   **Direct & Live Connection:** Engage directly with artists via a **real-time chat** system, commission custom pieces, and participate in live-streamed **events** like workshops and talks.
*   **Community Forum:** A public forum where users and artists can share work, discuss techniques, and build a community around their shared passion.
*   **Secure Authentication:** A robust and secure JWT-based authentication system ensures a safe and personalized experience.

### For the Artist:
*   **Complete Mission Control (Dashboard):** A dedicated, role-based dashboard where artists can easily upload and manage their artworks, courses, blogs, and hosted events.
*   **Multiple Revenue Streams:** Artists can sustain their livelihoods by selling physical art, offering digital courses, and accepting paid custom commissions through an integrated workflow.
*   **Content-Based Badging System:** An automatic, tiered badging system that rewards artists for their contributions. Artists earn "Creator," "Educator," and "Storyteller" badges for uploading art, creating courses, and writing blogs, providing them with visible credibility on the platform.
*   **Seamless Communication:** The real-time chat and notification system ensures artists never miss an opportunity to connect with a potential buyer or student.

---

## 4. Hackathon Bonus Features Implemented

We successfully implemented and enhanced all three bonus prompts for the Art & Culture theme:

1.  ✅ **User Authentication:** Implemented a secure, JWT-based system with httpOnly cookies, `SameSite` policies, and role-based access control.
2.  ✅ **Content-Based Badging System:** Implemented a multi-track, tiered (Bronze, Silver, Gold) badging system that automatically rewards artists for creating artworks, courses, and blogs.
3.  ✅ **Export Compliance:** Innovatively implemented via our **AI Art Concierge**, which provides on-demand, 24/7 guidance to artists on meeting international standards, making their products "Export Ready."

---

## 5. Technology Stack & Architecture

KalaKosha is a modern, full-stack MERN application, fully deployed with a professional CI/CD pipeline.

*   **Frontend:**
    *   **Framework:** React (Vite)
    *   **Routing:** React Router
    *   **State Management:** React Context API
    *   **Styling:** Custom CSS with a modular, component-based approach
    *   **Deployment:** **Vercel**

*   **Backend:**
    *   **Framework:** Node.js & Express.js
    *   **Database:** MongoDB (with Mongoose ODM)
    *   **Authentication:** JWT (JSON Web Tokens)
    *   **Image/Video Hosting:** Cloudinary
    *   **Deployment:** **Google Cloud Platform (Cloud Run)**

*   **AI & Services:**
    *   **AI Chatbot:** Botpress

---

## 6. Team Members
*   Rajath N H
*   Prajnan Vaidya
*   Preeti Bhat
*   Yashashwini D B
