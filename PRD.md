****PRD: Terms Simplified (MVP)****

**Product Manager: Rohan Sai Raj**

**Status: MVP Live**

**Tech Stack: Lovable (Frontend), Supabase (Backend/Auth), AI (Summarization Engine), Stateless Data Model with SSL encryption for file uploads**

**Live App:** easy-read-terms.lovable.app 

**1. Executive Summary**
- The Problem: Terms and Conditions are intentionally long, written in legalese, and hidden behind "I Accept" buttons. Users agree to data-sharing and auto-renewals without knowing it and consent to predatory terms because the documents are inaccessible to non-legal experts.
- The Solution: An AI-powered "Legal Translator" that summarizes complex documents into a human-readable summary in under 60 seconds with rapid risk detection, 6th-grade level readability, and a "Zero-Knowledge" privacy architecture.
- Product Vision: To empower users with informed consent by highlighting risks before they click "Accept."

**2. Target Audience**
- Primary: Elders, students, homemakers and busy professionals who use multiple SaaS/Apps daily.
- Secondary: Privacy-conscious users looking for specific "Data Sharing" or "Cancellation" clauses.
- Tertiary: All of the above with limited english understanding.
- User Persona:
   - The Busy Consumer who wants to protect their data but doesn't have 20 minutes to read a 50-page PDF.
   - The Cautious Consumer: Wants to know if a social media app sells their photos.
   - The Freelancer: Needs to ensure a new tool doesn't claim ownership of their creative work.

**3. Goals & Success Metrics**
- Goal 1: Reduce "Time-to-Comprehension" from 15+ minutes to < 60 seconds.
- Goal 2: Provide a clear "Verdict" (Safe/Caution/Risky) to enable instant decision-making.
- KPIs:
   - Success Rate: % of uploaded files successfully summarized.
   - User Engagement: Average number of summaries generated per session.
   - Comprehension Score: Qualitative feedback on summary clarity.
   
**4. Functional Requirements (MVP)**

| ID  | Feature | Description | Priority |
| ------------- | ------------- | -------- | --------- |
| FR1 | Multi-format Upload | Users can upload PDF, DOC, or DOCX files. | P0 |
| FR2  | AI Summarization | Convert legalese into bullet points for a 12-year-old reading level. | P0 |
| FR3 | Risk Detection | Auto-identify "Auto-renewals," "Data Sharing," and "Limited Liability." | P0 |
| FR4 | Verdict System | Visual badge (Green/Yellow/Red) based on AI risk assessment. | P1 |
| FR5 | Error Handling | Reject files >5MB or unsupported formats with user-friendly alerts. | P1 |
| FR6  | Image Support | Support screenshots and pickup readable text to generate summary | P2 |

**5. Non-Functional Requirements (MVP)**

| ID  | Feature | Description | Priority |
| ------------- | ------------- | -------- | --------- |
| NFR1 | Performance | Processing time < 60 seconds | P0 |
| NFR2  | Privacy | Immediate deletion of files post-session | P0 |

**6. User Journey**
- Landing: User arrives at a minimalist, high-trust UI.
- Upload: User drags and drops a T&C PDF.
- Processing: A loading state (Skeleton UI) indicates the AI is "reading" the document.
- Result: User sees a high-level Verdict, followed by 3-5 key bullet points.
- Action: User decides to accept or reject the service based on the summary.

**7. Technical & Design Constraints**
- Simplicity over Features: The UI must remain a single-page tool to reduce friction.
- Privacy First: As a legal tool, the uploaded files should not be stored permanently to maintain user trust (leveraging Supabase for temporary processing).
- Reading Level: The prompt engineering for the AI is strictly constrained to "6th-8th grade readability."

**8. Roadmap (Post-MVP)**
- V1 - MVP + Share Result button + AI disclaimer 
- V2 - Chrome Extension: Detect T&C pages automatically on sites like Amazon or Netflix.
- V3 - Image Upload Support + URL Fetcher: Paste a link to a T&C page instead of uploading a file.
- V4 - Historical Comparison: Alert users when a service they already use changes its terms.

**9. PM Review Comments (Strategic Insights)**
- On UX: The "60-second" value proposition is a strong hook for the landing page.
- On Risk: A key PM challenge here is "AI Hallucination." The roadmap includes a disclaimer that this is an "AI-assisted summary" and not professional legal advice—a critical step for product liability.
- On GTM: This tool is perfectly positioned for a "Product of the Day" launch on Product Hunt or as a viral tool on LinkedIn for privacy advocates.
