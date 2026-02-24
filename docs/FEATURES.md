# LMS — Complete Features Description

**Document Version:** 1.1  
**Last Updated:** 2025  
**Product:** Enterprise AI-Powered Learning Management System

---

## Table of Contents

1. [Platform Overview](#1-platform-overview)
2. [Authentication & Access](#2-authentication--access)
3. [Dashboard](#3-dashboard)
4. [Library & Books](#4-library--books)
5. [Courses & Academics](#5-courses--academics)
6. [Gamification](#6-gamification)
7. [Code Arena](#7-code-arena)
8. [AI Learning Intelligence](#8-ai-learning-intelligence)
9. [External Learning](#9-external-learning)
10. [Research Hub](#10-research-hub)
11. [Community & Network Effects](#11-community--network-effects)
12. [Micro-Learning](#12-micro-learning)
13. [Live Classes](#13-live-classes)
14. [Plagiarism](#14-plagiarism)
15. [Admin & Management](#15-admin--management)
16. [Enterprise SaaS Metrics](#16-enterprise-saas-metrics)
17. [Organization Intelligence](#17-organization-intelligence)
18. [User & Settings](#18-user--settings)
19. [Certificates](#19-certificates)
20. [Routes Reference](#20-routes-reference)
21. [Role-Based Access Matrix](#21-role-based-access-matrix)

---

## 1. Platform Overview

### What It Is

The LMS is a full-stack Learning Management System built as a modern single-page application (SPA). It combines traditional course management with AI-powered learning tools, external learning integrations, research discovery, and community features.

### Technical Details

| Aspect | Description |
|--------|-------------|
| **Frontend** | React 19 with Vite 7 for fast development and builds |
| **Styling** | Tailwind CSS 4 for utility-first styling |
| **Routing** | React Router 7 with lazy-loaded routes |
| **Layout** | Fixed 250px sidebar for navigation; main content uses `ml-[250px]` |
| **Font** | Roboto from Google Fonts for readability |
| **Data Mode** | Demo mode uses localStorage; production-ready for REST API |

### How It Works

- The app loads with a fixed sidebar on the left showing all navigation links.
- Main content area scrolls independently.
- Routes are protected; unauthenticated users are redirected to login.
- Role-based visibility controls which menu items each user sees.

---

## 2. Authentication & Access

### What It Is

Authentication controls who can access the platform and what they can do. Users must log in to use the app, and their role (Admin, Staff, or Member) determines their permissions.

### Feature Explanations

**Login**  
Users enter credentials to access the platform. On success, a token is stored and the user is redirected to the Dashboard. Failed attempts show an error message.

**Register**  
New users can create an account. Registration collects required information and creates a user profile. After registration, users can log in.

**Protected Routes**  
All app routes except Login, Register, and Certificate Verify require authentication. If a user is not logged in, they are redirected to the login page.

**Role-Based Access**  
- **Admin:** Full access including SaaS Metrics, Org Insights, External Learning Admin, Research Hub Admin.  
- **Staff:** Access to Plagiarism, Analytics, Members. No access to SaaS Metrics or Org Insights.  
- **Member:** Standard learning features only. No access to Members, Plagiarism, or Analytics.

**Token Storage**  
A JWT (JSON Web Token) is stored in `localStorage` after login. It is sent with API requests for authorization. Logout clears the token.

---

## 3. Dashboard

### What It Is

The Dashboard is the main landing page after login. It shows a personalized overview of learning activity, library stats (for staff/admin), and quick access to key sections.

### Feature Explanations

**Welcome Message**  
A greeting using the user’s first name (e.g., “Welcome, John”) to personalize the experience.

**Stats Cards (Admin/Staff)**  
Four cards for library management:  
- **Books:** Total books in the catalog  
- **Members:** Total registered members  
- **Issued Books:** Books currently issued  
- **Return Due:** Books due for return  

These help staff track library usage at a glance.

**Course Stats**  
Cards for learning activity:  
- **Enrolled Courses:** Number of courses the user is enrolled in  
- **Upcoming Assignments:** Assignments with future due dates that are not yet submitted  
- **Pending Grading:** (Staff/Admin) Submissions waiting for grading  
- **Exam Performance:** Placeholder for exam summary  

**At-Risk Students**  
For Admin/Staff: a list of students flagged as at-risk based on performance (e.g., low scores, weak topics). Each student shows name and risk level (Low, Medium, High).

**AI Dropout Risk Badge**  
For each at-risk student, an AI-predicted dropout risk badge can appear. The model uses inactivity, failed exams, and XP growth to estimate risk (low/medium/high) and a percentage score.

**XP Widget**  
Shows the user’s current level and total XP. The sidebar also has an XP progress bar for progress within the current level.

**Live Session**  
If there is an upcoming live session, its title and scheduled time are shown.

**Plagiarism Alerts**  
For Admin: count of submissions flagged for plagiarism, with a link to the Plagiarism page.

**Explore Global Courses**  
Up to 5 featured courses from external platforms (e.g., Coursera, Udemy). Each card has title, platform, category, and an “Open Course” button that opens the external link.

**Announcements**  
A section for library news and announcements (e.g., closures, new collections, events).

**Books Section**  
Search and filter the book catalog. Users can search by title or author and filter by status (All, Available, Issued). Admin/Staff can add new books.

**Book Modal**  
Clicking a book opens a modal with:  
- Title, author, description, status  
- Reviews and ratings  
- Option to add a review and rating  
- For staff: “Issue Book” to assign the book to a member  

---

## 4. Library & Books

### What It Is

The Library manages the physical/digital book collection. Users can browse, search, and (for staff) issue books. Members can favorite books and leave reviews.

### Feature Explanations

**Book Catalog**  
A searchable list of all books. Users can search by title or author and filter by availability (All, Available, Issued).

**Book Cards**  
Each book is shown as a card with:  
- Title and author  
- ISBN  
- Genre  
- Availability status (Available or Borrowed)  
- Favorite button  
- For Admin: Edit and Delete  

**Favorites**  
Users can add or remove books from favorites. Favorites are listed on the Favorites page for quick access.

**Issue Book**  
Staff can issue a book to a member. They select the member and confirm. The book status changes to Issued and is linked to that member.

**Review & Rating**  
Users can add text reviews and star ratings (1–5) for books they have used. Reviews appear in the Book Modal for other users.

**Add Book**  
Staff can add new books with title, author, ISBN, genre, description, and other metadata.

**Edit Book**  
Admin can edit existing book records. Changes apply to the catalog immediately.

**Admin Actions**  
Admin can edit and delete books. Delete typically requires confirmation to avoid accidental removal.

---

## 5. Courses & Academics

### What It Is

Courses are the core learning units. Each course has lessons, assignments, and exams. Users enroll in courses, complete lessons in order, submit assignments, and take exams. Progress is tracked throughout.

### Feature Explanations

**Course Catalog**  
A grid of all courses. Each card shows title, description, level (e.g., Beginner, Intermediate), and category. Users can browse and open course details.

**Course Grid**  
Courses are displayed in a responsive grid. Cards show key information and a link to the course detail page.

**Create Course**  
Staff/Admin can create new courses. The form includes title, description, level, category, and status (Draft, Published, Archived).

**Course Detail**  
The main course page with tabs:  
- **Overview:** Description and counts (lessons, assignments, exams, enrolled)  
- **Lessons:** List of lessons with completion status  
- **Assignments:** List of assignments with due dates  
- **Exams:** List of exams with duration and marks  
- **Students:** (Staff/Admin) Enrolled students and progress  

**Enrollment**  
For published courses, users can enroll. Enrollment creates a record and unlocks the course content. Progress is tracked per enrollment.

**Lessons**  
Lessons are the main content units. They are ordered and can be marked complete. Lesson content can include text, media, or links.

**Lesson Completion**  
Users mark lessons as complete. Completion unlocks the next lesson (unless it’s a preview). Progress percentage is updated.

**Assignments**  
Assignments have a title, description, due date, and max marks. Users submit work before the due date. Staff grade submissions and update status.

**Submissions**  
Users submit work for assignments. Submissions have statuses such as Submitted, Graded. Staff see pending submissions in Dashboard and on the Plagiarism page if flagged.

**Exams**  
Exams are timed assessments with multiple questions. They have duration, total marks, and passing marks. Users take exams and receive a score.

**Exam Attempts**  
Each exam attempt is recorded with score, pass/fail, and timestamp. Users can review their performance; staff can analyze results.

**My Learning**  
A page listing all enrolled courses with progress. Users can open any course and continue from where they left off.

**AI Study Copilot**  
In the Course Detail sidebar (when enrolled and a lesson is selected), users can:  
- **Summarize:** Get an AI summary of the lesson  
- **Generate Quiz:** Create practice questions from the lesson  
- **Explain Concept:** Enter a concept and get a simple explanation  

Usage is tracked for subscription limits.

---

## 6. Gamification

### What It Is

Gamification adds game-like elements to learning: XP, levels, badges, and leaderboards. It encourages engagement and makes progress visible.

### Feature Explanations

**XP System**  
Users earn experience points (XP) from activities (e.g., completing lessons, passing exams, code submissions). XP is stored per user and accumulates over time.

**Levels**  
Levels are derived from total XP (e.g., every 100 XP = 1 level). Higher levels indicate more activity and progress.

**XP Progress Bar**  
The sidebar shows a progress bar for the current level. It fills as the user earns XP within that level and resets when they level up.

**Leaderboard**  
A ranked list of top users by XP. It shows rank, name, XP, and badges. Updates as users earn more XP.

**Badges**  
Badges are earned for achievements (e.g., first course completion, streak). They appear on the profile and leaderboard.

**Skill Tree**  
A visual representation of skills and progress. Users see which skills they have and which are next, supporting structured learning paths.

---

## 7. Code Arena

### What It Is

Code Arena is a practice environment for coding. Users solve programming problems, write and run code in the browser, and submit solutions. It supports competitive-style practice.

### Feature Explanations

**Problem List**  
A list of coding problems. Users can filter by difficulty: All, Easy, Medium, Hard. Each problem has a title, description, and difficulty badge.

**Problem Cards**  
Each problem is shown as a card with title, short description, difficulty, and a “Solve” button that opens the code editor modal.

**Code Editor**  
A full-screen modal with a code editor (JavaScript). Users write code, run it, and submit. The editor supports syntax and basic editing.

**Run Code**  
Users can run code without submitting. Output is shown in a terminal-style panel. This helps debug before submission.

**Submit**  
Submitting sends the solution for evaluation. The system returns status (Accepted, Wrong Answer, Error) and any output or error messages.

**Status Feedback**  
After run or submit, a status badge shows:  
- **Accepted:** Solution is correct  
- **Wrong Answer:** Logic error  
- **Error:** Runtime or other error  

**Output Panel**  
A dark, terminal-style panel shows stdout, stderr, and evaluation results. It supports scrolling for long output.

---

## 8. AI Learning Intelligence

### What It Is

AI Learning Intelligence uses AI to personalize learning. It generates learning paths, assists during courses, and predicts dropout risk. Built to support both mock and real AI backends.

### Feature Explanations

**Personalized Learning Path**  
Users can generate a learning path based on:  
- Enrolled courses and progress  
- Total XP  
- Skill tree progress  

The AI returns:  
- **Skill Gaps:** Skills to improve, with priority  
- **Suggested Courses:** Courses that address gaps, with relevance %  
- **Estimated Time to Mastery:** e.g., “4–6 weeks”  
- **Readiness %:** Readiness for a target career path  

Results are stored (e.g., in localStorage) and can be refreshed.

**AI Insights Dashboard**  
A dedicated page (`/ai-insights`) where users generate and view their learning path. It shows readiness, time to mastery, suggested courses, and skill gaps in cards and lists.

**AI Study Copilot**  
Inside Course Detail, when a lesson is selected, users can:  
- **Summarize:** Get a short summary of the lesson  
- **Generate Quiz:** Create multiple-choice questions  
- **Explain Concept:** Type a concept and get a simple explanation  

Each action is counted for usage limits.

**Dropout Risk Predictor**  
A model estimates dropout risk from:  
- Inactivity (e.g., days since last activity)  
- Failed exams  
- Low XP growth  

It returns a risk score (0–100) and level (low/medium/high). For at-risk students on the Admin Dashboard, a badge shows this risk.

**Token Usage Tracking**  
Each AI action (summarize, quiz, explain, learning path) is logged per user. This supports usage limits and overage handling for subscription plans.

**Storage**  
Recommendations and usage are stored client-side (e.g., localStorage) in demo mode. The design allows switching to API storage for production.

---

## 9. External Learning

### What It Is

External Learning connects the LMS to third-party platforms (e.g., Coursera, Udemy). Users discover and open external courses without leaving the app.

### Feature Explanations

**Platform Grid**  
A grid of supported external platforms. Each card shows logo, name, description, and category.

**Platform Cards**  
Each platform is a card with:  
- Logo (or fallback)  
- Name and short description  
- Category badge  
- “Browse courses” link  

**Browse Courses**  
Clicking a platform opens its course list. Courses show thumbnail, title, level, category, and an “Open Course” button.

**Popular Now**  
A section of featured courses from external platforms. These are highlighted for quick discovery.

**Recommended**  
A placeholder for personalized recommendations based on learning history. Structure is ready for future logic.

**Search & Filter**  
Users can search platforms by name or description and filter by category to narrow results.

**Open Course**  
Clicking “Open Course” opens the external course URL in a new tab. The system may track opens for analytics.

---

## 10. Research Hub

### What It Is

Research Hub helps users find open-access research. It aggregates metadata from multiple sources and supports bookmarking and citation.

### Feature Explanations

**Platform Grid**  
A grid of research platforms (e.g., PubMed, arXiv). Each platform has a type badge (Open Access, Public Domain, API Integrated).

**Search**  
Users can search by:  
- Keyword  
- Category  
- Platform  
- Year  

Results are filtered across platforms.

**Resources**  
Each resource is a card with:  
- Title  
- Authors and year  
- Abstract (truncated)  
- Category and tags  
- Open Access badge if applicable  

**Featured Research**  
A section of highlighted resources for quick discovery.

**Bookmark**  
Users can save resources to “My Research.” Bookmarked items appear on the My Research page.

**Citations**  
Users can copy citations in APA or MLA format. A “Citation copied” message confirms the action.

**Redirect Disclaimer**  
Before opening an external link, a modal explains that the user is leaving the platform and that only metadata is stored. Users must confirm to proceed.

---

## 11. Community & Network Effects

### What It Is

Community adds social and collaborative features: course discussions, reputation, and a mentor marketplace. It encourages peer support and engagement.

### Feature Explanations

**Course Discussions**  
Each course can have a discussion feed. Users can:  
- **Post:** Start a new discussion  
- **Comment:** Reply to posts  
- **Upvote:** Upvote posts and comments  

Posts are ordered by date. Discussions are scoped per course.

**Reputation Leaderboard**  
Users earn reputation points from contributions (e.g., helpful posts, upvotes). The leaderboard ranks users by reputation and can show levels (e.g., New, Helper, Contributor).

**Mentor Marketplace**  
A list of mentors with:  
- Name  
- Expertise areas  
- Rating and session count  
- “Book Session” button  

Phase 1 is a mock; booking and payments are placeholders.

**Discussion Feed**  
Posts appear in chronological order. Each post shows author, content, timestamp, and upvote count. Users can upvote to highlight useful content.

**Routes**  
- `/community`: Hub with course list, leaderboard, and mentors  
- `/community/:courseId`: Discussion feed for a specific course  

---

## 12. Micro-Learning

### What It Is

Micro-Learning supports short, focused learning via flashcards and spaced repetition. It helps reinforce concepts over time.

### Feature Explanations

**Daily Review**  
A daily review session built around flashcards. Users see cards one by one and indicate how well they remembered the content.

**Review Cards**  
Each card has a question/prompt on one side and an answer on the other. Users flip the card to reveal the answer and rate their recall. The system uses this to schedule future reviews (spaced repetition).

---

## 13. Live Classes

### What It Is

Live Classes represent scheduled live sessions (e.g., webinars, workshops). Users can see what’s coming up and join when the time comes.

### Feature Explanations

**Sessions List**  
A list of upcoming live sessions. Each item shows title, date/time, and short description.

**Session Details**  
For each session, users see:  
- Title  
- Full description  
- Scheduled date and time  
- Any join link or instructions  

---

## 14. Plagiarism

### What It Is

Plagiarism tools help staff detect and review potentially copied work. Flagged submissions are listed for review.

### Feature Explanations

**Flagged Reports**  
A list of submissions that have been flagged (e.g., by similarity checks). Each report links to the submission and related context.

**Review**  
Staff can open each report, compare with sources, and decide:  
- Dismiss (false positive)  
- Escalate  
- Apply a penalty or follow-up action  

**Access**  
Plagiarism is available only to Admin and Staff.

---

## 15. Admin & Management

### What It Is

Admin and Management features support running the platform: members, transactions, analytics, and configuration of external learning and research.

### Feature Explanations

**Members**  
A list of all members with key details. Staff/Admin can view and manage members. Members cannot see this page.

**Transactions**  
A history of transactions (e.g., book issues, returns, enrollments). Supports auditing and reporting.

**Analytics**  
A BI-style dashboard with:  
- Revenue Trends (chart placeholder)  
- User Growth (chart placeholder)  
- Course Completion Heatmap (placeholder)  
- Date range filters (7d, 30d, 90d)  
- Export CSV  

Charts are placeholders for future chart libraries.

**External Learning Admin**  
Admin can add, edit, and remove external learning platforms and their courses. This controls what appears in External Learning.

**Research Hub Admin**  
Admin can add, edit, and remove research platforms and resources. This controls what appears in Research Hub.

---

## 16. Enterprise SaaS Metrics

### What It Is

SaaS Metrics provide business and product metrics for the platform as a SaaS product. It supports revenue tracking, usage, and plan health.

### Feature Explanations

**MRR (Monthly Recurring Revenue)**  
Total recurring revenue per month from subscriptions. Shown as a primary KPI.

**ARR (Annual Recurring Revenue)**  
MRR projected to a full year. Used for annual planning and valuation.

**Active Users**  
Count of users active in the current period (e.g., this month). Indicates engagement.

**Churn Rate**  
Percentage of subscribers who cancel in a period. Lower churn is better for growth.

**Plan Distribution**  
Breakdown of subscribers by plan (Free, Starter, Pro, Enterprise) with seat counts and revenue per plan.

**Feature Usage**  
Usage of key features vs. plan limits:  
- AI calls  
- Exams taken  
- Code submissions  

Progress bars show how close each limit is.

**Upgrade Recommendation**  
A banner or message when usage is near limits, suggesting an upgrade to avoid overages or restrictions.

**CSV Export**  
Export of metrics data for reporting and analysis.

**Route:** `/admin/saas-metrics`  
**Access:** Admin only

---

## 17. Organization Intelligence

### What It Is

Organization Intelligence gives admins a view of performance and usage at the organization level. It supports multi-tenant and enterprise use cases.

### Feature Explanations

**Performance Score**  
A single score (e.g., 0–100) for overall organization performance, combining engagement, completion, and other factors.

**Skill Heatmap**  
A view of skill levels across the organization. Shows which skills are strong and which need development.

**Department Comparison**  
Comparison of departments by:  
- Average progress  
- Number of learners  
- Other relevant metrics  

Helps identify strong and weak departments.

**Seat Utilization**  
Percentage of purchased seats that are in use. High utilization may indicate need for more seats.

**AI Usage**  
Total AI calls used by the organization in the period. Supports cost and limit management.

**Revenue**  
MRR attributed to the organization. Supports revenue reporting per tenant.

**Route:** `/admin/organizations/:id/insights`  
**Access:** Admin only

---

## 18. User & Settings

### What It Is

User and Settings cover profile, preferences, saved items, and subscription information.

### Feature Explanations

**Profile**  
The user’s profile page with name, email, role, and other account details. Can be extended for avatar, bio, etc.

**Settings**  
Application settings (e.g., theme, notifications, language). Changes apply across the app.

**Favorites**  
A list of favorited items (e.g., books). Users can add/remove favorites from detail views.

**Reports**  
A page for various reports (e.g., learning reports, activity). Structure supports multiple report types.

**Pricing**  
Subscription plans with:  
- Plan name  
- Price (monthly/yearly)  
- Features and limits  
- Upgrade options  

---

## 19. Certificates

### What It Is

Certificates are issued when users complete courses or meet other criteria. Verification is public so employers or others can confirm authenticity.

### Feature Explanations

**Verify**  
A public page where anyone can verify a certificate by entering a code. The page shows whether the certificate is valid and basic details (e.g., recipient, course, date).

**Route:** `/verify/:code` (public, no login required)

---

## 20. Routes Reference

| Route | Page | Access |
|-------|------|--------|
| `/` | Dashboard | All |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/transactions` | Transactions | All |
| `/members` | Members | Non-Member |
| `/courses` | Courses | All |
| `/courses/new` | Create Course | All |
| `/courses/:id` | Course Detail | All |
| `/courses/:courseId/assignments/:assignmentId` | Assignment Detail | All |
| `/courses/:courseId/exams/:examId` | Exam Attempt | All |
| `/my-learning` | My Learning | All |
| `/leaderboard` | Leaderboard | All |
| `/skill-tree` | Skill Tree | All |
| `/live-classes` | Live Classes | All |
| `/plagiarism` | Plagiarism | Admin/Staff |
| `/pricing` | Pricing | All |
| `/daily-review` | Daily Review | All |
| `/code-arena` | Code Arena | All |
| `/ai-insights` | AI Insights | All |
| `/community` | Community | All |
| `/community/:courseId` | Course Discussion | All |
| `/external-learning` | External Learning | All |
| `/external-learning/:platformId` | Platform Detail | All |
| `/admin/external-learning` | External Learning Admin | Admin |
| `/research` | Research Hub | All |
| `/research/:platformId` | Platform Detail | All |
| `/my-research` | My Research | All |
| `/admin/research` | Research Hub Admin | Admin |
| `/admin/analytics` | Analytics | Admin/Staff |
| `/admin/saas-metrics` | SaaS Metrics | Admin |
| `/admin/organizations/:id/insights` | Org Insights | Admin |
| `/profile` | Profile | All |
| `/settings` | Settings | All |
| `/reports` | Reports | All |
| `/favorites` | Favorites | All |
| `/verify/:code` | Certificate Verify | Public |

---

## 21. Role-Based Access Matrix

| Feature | Admin | Staff | Member |
|---------|-------|-------|--------|
| Dashboard | ✓ | ✓ | ✓ |
| Books & Library | ✓ | ✓ | ✓ |
| Courses & Learning | ✓ | ✓ | ✓ |
| Code Arena | ✓ | ✓ | ✓ |
| AI Insights | ✓ | ✓ | ✓ |
| Community | ✓ | ✓ | ✓ |
| External Learning | ✓ | ✓ | ✓ |
| Research Hub | ✓ | ✓ | ✓ |
| Members | ✓ | ✓ | ✗ |
| Plagiarism | ✓ | ✓ | ✗ |
| Analytics | ✓ | ✓ | ✗ |
| SaaS Metrics | ✓ | ✗ | ✗ |
| Org Insights | ✓ | ✗ | ✗ |
| External Learning Admin | ✓ | ✗ | ✗ |
| Research Hub Admin | ✓ | ✗ | ✗ |

---

## Contexts & Data Layer

| Context | Purpose |
|---------|---------|
| AuthContext | Authentication state |
| BooksContext | Books, favorites, reviews |
| MembersContext | Members |
| AcademicsContext | Courses, lessons, assignments, exams, enrollments |
| GamificationContext | XP, badges, leaderboard |
| SkillTreeContext | Skill tree |
| LiveClassesContext | Live sessions |
| PlagiarismContext | Plagiarism reports |
| CertificateContext | Certificates |
| MicroLearningContext | Daily review flashcards |
| CodeArenaContext | Code problems, submissions |
| ExternalLearningContext | External platforms, courses |
| ResearchContext | Research platforms, resources |
| AnalyticsContext | BI analytics |
| PerformanceContext | At-risk students |
| OrganizationContext | Organizations |
| SubscriptionContext | Subscriptions, usage, plans |
| ThemeContext | Theme settings |
| AIContext | AI recommendations, usage tracking |
| SaaSAnalyticsContext | SaaS metrics |
| CommunityContext | Posts, comments, reputation, mentors |

---

*End of Document*
