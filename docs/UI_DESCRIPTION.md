# LMS User Interface Description

A comprehensive description of the Learning Management System (LMS) user interface.

---

## 1. Overall Layout

The application uses a **fixed sidebar + main content** layout:

| Area | Width | Description |
|------|-------|-------------|
| **Sidebar** | 250px, fixed | Left navigation panel, always visible |
| **Main content** | `ml-[250px]` | Right area, scrollable, contains page content |

- **Responsive**: Main content adapts to viewport width
- **Font**: Roboto (from Google Fonts)
- **Framework**: Tailwind CSS 4

---

## 2. Sidebar Navigation

### Structure
- **Header**: "LMS" logo/title (bold, large)
- **Nav links**: Vertical list with rounded hover/active states
- **Scroll**: Vertical scroll when links overflow
- **Footer**: XP bar, Level, Logout button

### Visual States
- **Default**: Gray background (`bg-gray-100`)
- **Hover**: Light blue (`#8EA4D2`), white text
- **Active**: Dark gray (`#49516F`), white text

### Navigation Items (in order)
1. Dashboard  
2. Transactions  
3. Courses  
4. My Learning  
5. Leaderboard  
6. Skill Tree  
7. Live Classes  
8. Daily Review  
9. Code Arena  
10. External Learning  
11. Research Hub  
12. My Research  
13. Plagiarism *(Staff/Admin only)*  
14. Members *(non-Member roles)*  
15. Profile  
16. Favorites  
17. Reports  
18. Analytics *(Staff/Admin only)*  
19. External Learning Admin *(Admin only)*  
20. Research Hub Admin *(Admin only)*  
21. Pricing  
22. Settings  

### XP Section (when logged in)
- Level badge with amber icon
- Progress bar (amber fill)
- Total XP count
- Logout button (red outline)

---

## 3. Page Structure

### Common Page Pattern
```
[Page Header - title + subtitle]
[Filters / Actions - search, buttons]
[Content Area - cards, lists, grids]
[Optional Footer / Note]
```

### Page Headers
- **page-header-subtle**: Light gradient (gray → indigo), icon accent, title, subtitle
- **page-header**: Bold gradient (indigo → purple), white text

---

## 4. Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Welcome, stats cards, books, announcements |
| `/transactions` | Transactions | Transaction history/list |
| `/courses` | Courses | Course catalog grid |
| `/courses/new` | Create Course | Course creation form |
| `/courses/:id` | Course Detail | Single course view |
| `/courses/:courseId/assignments/:id` | Assignment Detail | Assignment view |
| `/courses/:courseId/exams/:id` | Exam Attempt | Take exam |
| `/my-learning` | My Learning | Enrolled courses |
| `/leaderboard` | Leaderboard | Gamification rankings |
| `/skill-tree` | Skill Tree | Skill progression UI |
| `/live-classes` | Live Classes | Upcoming sessions |
| `/daily-review` | Daily Review | Spaced repetition flashcards |
| `/code-arena` | Code Arena | Coding problems, Solve button |
| `/external-learning` | External Learning | Platform cards (Coursera, Udemy, etc.) |
| `/external-learning/:platformId` | Platform Detail | Courses per platform |
| `/research` | Research Hub | Open-access research platforms |
| `/research/:platformId` | Platform Detail | Resources per platform |
| `/my-research` | My Research | Bookmarked research |
| `/plagiarism` | Plagiarism | Review flagged submissions |
| `/members` | Members | Member management |
| `/profile` | Profile | User profile |
| `/favorites` | Favorites | Saved items |
| `/reports` | Reports | Report views |
| `/admin/analytics` | Admin Analytics | BI analytics, CSV export |
| `/admin/external-learning` | External Learning Admin | Manage platforms/courses |
| `/admin/research` | Research Hub Admin | Manage research platforms/resources |
| `/pricing` | Pricing | Subscription plans |
| `/settings` | Settings | App settings |
| `/login` | Login | Auth form |
| `/register` | Register | Registration form |
| `/verify/:code` | Certificate Verify | Public certificate verification |

---

## 5. Key Components

### Cards
- **Card**: Base card (`bg-gray-200`, rounded, padding)
- **card-decorated**: White, border, shadow, hover lift
- **card-accent-left**: 4px indigo left border
- **DashboardCard**: Title, count, icon
- **BookCard**: Book cover, title, author, status
- **PlatformCard**: Logo, name, description, category
- **CourseGridCard**: Thumbnail, title, level, Open button
- **ResearchResourceCard**: Title, authors, abstract, bookmark, citation

### Buttons
- **btn-primary**: Indigo, Run/Solve actions
- **btn-success**: Green, Submit/Confirm
- **btn-secondary**: Gray outline, Cancel

### Badges
- **badge-easy**: Green pill (Easy)
- **badge-medium**: Amber pill (Medium)
- **badge-hard**: Red pill (Hard)
- **badge-featured**: Indigo pill

### Modals
- **Modal**: Centered, backdrop blur, close (X)
- **CodeEditorModal**: Full code editor + output panel
- **RedirectDisclaimerModal**: External link warning
- **AddEditBookModal**: Book form

### Forms
- **Input**: Border, focus ring
- **Select**: Dropdown with filter icon
- **Textarea**: Monospace for code

---

## 6. Code Arena UI

### List View
- Page header with icon
- Difficulty filters: All, Easy, Medium, Hard
- Problem cards: title, description, difficulty badge, Solve button
- Note banner at bottom

### Code Editor Modal
- **Header**: Problem title, description, difficulty badge, close
- **Left**: Code textarea (JavaScript), Run + Submit buttons
- **Right**: Output panel (dark terminal style), status badge (Accepted/Wrong Answer/Error)
- **Footer**: "Code runs in browser" note

---

## 7. External Learning UI

- **Featured**: "Popular Now" section with course cards
- **Recommended**: Placeholder section
- **Platforms**: Grid of platform cards (logo, name, description, category)
- **Filters**: Search, category dropdown
- **Course cards**: Thumbnail, title, level, Open Course button

---

## 8. Research Hub UI

- **Featured**: Featured research section
- **Search**: Keyword, category, platform, year filters
- **Platforms**: Grid with type badges (OpenAccess, PublicDomain, APIIntegrated)
- **Resources**: Cards with title, authors, abstract, bookmark, APA/MLA citation copy
- **Redirect**: Disclaimer modal before external links

---

## 9. Dashboard UI

- Welcome message
- Stats cards: Books, Members, Issued, Return Due
- Course/assessment cards: Enrolled, Assignments, Pending Grading
- At-Risk Students (Admin)
- XP & Live Session widgets
- Plagiarism alerts (Admin)
- Announcements
- Explore Global Courses (5 featured external courses)
- Books section: search, filter, grid

---

## 10. Notifications

- **Toast**: Green banner, top-right, auto-dismiss (2s)
- **Context**: NotificationContext provides `toast(message)`

---

## 11. Loading & Feedback

- **Loader**: Fullscreen or inline spinner
- **Suspense**: Lazy-loaded routes show Loader
- **Disabled states**: Buttons gray out when loading

---

## 12. Color Palette

| Purpose | Color | Hex/Class |
|---------|-------|-----------|
| Primary | Indigo | indigo-500 |
| Success | Green | green-500 |
| Warning | Amber | amber-500 |
| Error | Red | red-500 |
| Sidebar active | Dark gray | #49516F |
| Sidebar hover | Light blue | #8EA4D2 |
| XP accent | Amber | amber-500 |

---

## 13. Responsive Behavior

- **Sidebar**: Fixed 250px
- **Main**: `ml-[250px]`, full height
- **Grids**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- **Modals**: `max-w-4xl`, scrollable on small screens

---

## 14. Accessibility

- Semantic HTML
- Focus states on interactive elements
- Alt text on images
- ARIA where applicable
