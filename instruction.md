# Project Overview

The system is an institutional web platform for an association named **ALEM**. It serves two distinct types of users:

1. **Visitors** (general public, including beneficiaries with special needs, prospective volunteers, and donors) who browse public institutional content, submit support/tracking requests, apply as volunteers, and make donation declarations.
2. **A single Administrator** who manages all content and operational data through a restricted admin panel at `/admin`.

The platform combines:
- A public-facing informational site (institutional pages: history, mission, vision, values, activity pillars, highlights/news, contacts, location, terms of use).
- A donation information area (no real payment processing; only payment instructions are displayed, and donor-submitted records are confirmed manually offline by association staff).
- A submission system for beneficiaries (tracking/support requests) and volunteers (applications).
- An administrative back office for managing projects, volunteers, support requests, donations, partners, team members, beneficiary stories, and for generating filtered PDF reports.

The system must be responsive across mobile, tablet, and desktop devices, and must follow accessibility best practices given the target audience (which includes people with special needs).

---

# Business Goals

- Present the ALEM association's identity (history, mission, vision, values) to the public.
- Inform the public about ongoing intervention activities organized by pillar ("What We Do").
- Publicize social projects, events, and achieved results through highlights/publications.
- Provide accessible channels of contact (Email, WhatsApp, Facebook, Instagram).
- Allow beneficiaries with special needs to request tracking/support services.
- Allow members of the public to apply as volunteers.
- Provide information to enable financial support/donations (without processing real payments inside the system).
- Allow a single administrator to manage all public content and operational records (projects, volunteers, support requests, donations, partners, team, beneficiary stories).
- Allow the administrator to generate PDF reports of tracking requests, volunteer applications, and donations, filtered by date range.

---

# Functional Requirements

## FR-001
**Description:** Presentation of ALEM (history, mission, vision, values).
**Actors:** Visitor
**Inputs:** None (read-only page navigation)
**Process:** System renders institutional content describing ALEM's history, mission, vision, and values.
**Outputs:** Rendered "About Us" page.
**Acceptance Criteria:** Visitor can view history, mission, vision, and values without authentication. Priority: High.

## FR-002
**Description:** "What We Do" page.
**Actors:** Visitor
**Inputs:** None
**Process:** System displays intervention activities organized by pillar.
**Outputs:** Page listing activities grouped by pillar.
**Acceptance Criteria:** Visitor can view and follow intervention activities for each pillar. Priority: High.

## FR-003
**Description:** Highlights.
**Actors:** Visitor
**Inputs:** None
**Process:** System makes available publications about social projects, events, and achieved results. Includes a detail page per project.
**Outputs:** List of highlights and individual project detail pages.
**Acceptance Criteria:** Visitor can browse highlights and open a detail view for each project. Priority: High.

## FR-004
**Description:** Contact page.
**Actors:** Visitor
**Inputs:** None (navigation only on this sub-requirement; see FR-005/FR-006 for the forms hosted on this page)
**Process:** System displays contact channels: Email, WhatsApp, Facebook, Instagram.
**Outputs:** Contact information/links.
**Acceptance Criteria:** Visitor can reach ALEM via Email, WhatsApp, Facebook, or Instagram from the Contacts page. Priority: High.

## FR-005
**Description:** Beneficiary registration (tracking/support request).
**Actors:** Visitor (beneficiary with special needs)
**Inputs:** Name, email, phone, gender, date of birth, address, type of special need, description.
**Process:** Beneficiary submits the request through the registration form on the Contacts page ("request support" tab). The request is stored with status **Pending**.
**Outputs:** Submitted tracking/support request record; confirmation feedback to the user.
**Acceptance Criteria:** Submitted request is persisted with status Pending and all collected fields. Priority: High.

## FR-006
**Description:** Volunteer application.
**Actors:** Visitor (prospective volunteer)
**Inputs:** Personal data, area of interest, chosen activity.
**Process:** Visitor applies through the form on the Contacts page ("become volunteer" tab). The application is stored with status **Pending**.
**Outputs:** Submitted volunteer application record; confirmation feedback to the user.
**Acceptance Criteria:** Submitted application is persisted with status Pending and all collected fields. Priority: High.

## FR-007
**Description:** Donations area.
**Actors:** Visitor (donor)
**Inputs:** Selected cause/project (dynamic list of existing projects, or general option), donation amount, payment method (M-Pesa, bank transfer/IBAN, card).
**Process:** Visitor selects a cause, enters a value, chooses a payment method and is shown the corresponding instruction (M-Pesa number, IBAN, or card redirection notice). Visitor confirms. The system records the donation with status **Pending**; no real payment is processed.
**Outputs:** Donation record with status Pending; thank-you confirmation screen.
**Acceptance Criteria:** Visitor sees correct instructions for the chosen payment method and the donation is saved as Pending; no payment gateway integration occurs. Priority: High.

## FR-008
**Description:** Responsiveness.
**Actors:** Visitor, Administrator
**Inputs:** N/A
**Process:** UI adapts layout to mobile, tablet, and desktop screen sizes.
**Outputs:** Responsive rendering across devices.
**Acceptance Criteria:** All pages are usable and correctly displayed on mobile, tablet, and desktop. Priority: High.

## FR-009
**Description:** Terms of use page.
**Actors:** Visitor
**Inputs:** None
**Process:** System displays a static terms of use page.
**Outputs:** Terms of use content.
**Acceptance Criteria:** Visitor can access and read the terms of use page. Priority: Medium.

## FR-010
**Description:** Administrator authentication.
**Actors:** Administrator
**Inputs:** Email, password.
**Process:** System authenticates a single fixed administrator account via credentials at the `/admin` route (a public route with no visible link in normal navigation). Access to the admin panel is restricted to this account.
**Outputs:** Authenticated admin session or authentication error.
**Acceptance Criteria:** Only the single configured administrator account can log in; access to the panel is denied without valid credentials. Priority: High.

## FR-011
**Description:** Publication management (highlights, beneficiary stories, team).
**Actors:** Administrator
**Inputs:** Publication content (highlight, story, or team member data).
**Process:** Administrator creates, edits, publishes, and removes highlights, beneficiary stories, and team members directly from the admin panel.
**Outputs:** Created/updated/removed publication records visible (when published) to visitors.
**Acceptance Criteria:** Administrator can perform full CRUD and publish/unpublish actions on highlights, stories, and team entries. Priority: High.

## FR-012
**Description:** Partner management.
**Actors:** Administrator
**Inputs:** Partner data (name, logo/photo).
**Process:** Administrator adds and removes partners from the system.
**Outputs:** Updated partner list.
**Acceptance Criteria:** Administrator can add and remove partner records. Priority: High.

## FR-013
**Description:** Tracking request management.
**Actors:** Administrator
**Inputs:** Status update (Approved / Refused).
**Process:** Administrator views submitted tracking/support requests and edits their status. Requests start as Pending. If marked as **Refused**, the record is permanently **deleted from the database** (no history of the request or refusal reason is kept).
**Outputs:** Updated request status, or permanent deletion if refused.
**Acceptance Criteria:** Administrator can list, filter, and transition requests from Pending to Approved or Refused; refusal results in irreversible deletion with no audit trail. Priority: High.

## FR-014
**Description:** Volunteer application management.
**Actors:** Administrator
**Inputs:** Status update (Approved / Refused); "mark as read" flag.
**Process:** Administrator views received volunteer applications, can filter by date range, mark applications as read, and edit application status. Applications start as Pending. If marked as **Refused**, the record is **permanently deleted**.
**Outputs:** Updated application status, or permanent deletion if refused.
**Acceptance Criteria:** Administrator can list, filter by date range, mark as read, and transition applications from Pending to Approved or Refused; refusal results in irreversible deletion. Priority: High.

## FR-015
**Description:** Donation management.
**Actors:** Administrator
**Inputs:** Status update (Confirmed / Not Confirmed).
**Process:** Administrator tracks received donations, filters by date range, sees total amount raised in the period, and edits donation status. Donations start as Pending. If marked as **Not Confirmed**, the record is **deleted from the admin panel**.
**Outputs:** Updated donation status, total raised for the filtered period, or deletion if not confirmed.
**Acceptance Criteria:** Administrator can list, filter by date range, view period totals, and transition donations from Pending to Confirmed or Not Confirmed; "Not Confirmed" results in deletion from the panel. Priority: High.

## FR-016
**Description:** Report generation.
**Actors:** Administrator
**Inputs:** Start date, end date.
**Process:** Administrator generates a PDF file containing tracking requests, volunteer applications, and donations received, filtered by the selected date range.
**Outputs:** Downloadable/exportable PDF report.
**Acceptance Criteria:** Administrator can produce a PDF report restricted to the chosen date range, covering all three record types. Priority: High.

---

# Non-Functional Requirements

## RNF-01 — Secure Authentication
Access to the administrative panel must be protected by an authentication system with session control. Priority: High.

## RNF-02 — Scalability
The system must support growth in content volume over time. Priority: High.

## RNF-03 — Data Integrity
The system must ensure the consistency and integrity of registered data. Priority: High.

## RNF-04 — Usability / Accessibility
The interface must follow accessibility best practices (ARIA labels, keyboard navigation, screen-reader compatibility), taking into account the project's target audience (which includes individuals with special needs). Priority: High.

## RNF-05 — Data Security
Personal data of users (beneficiaries, volunteers, donors) must be stored with encryption and access control, protecting the privacy of those involved. Priority: High.

*Note: The PDF does not explicitly list Performance, Availability, Reliability, or Maintainability requirements. These categories are not included beyond what is stated above; see Open Questions.*

---

# Recommended Architecture

```text
React Client
      |
      v
Node.js REST API
      |
      v
Supabase (Database + Auth + Storage)
```

**React Client:** Renders all public pages (Home, About Us, What We Do, Highlights, Contacts, Location, Terms of Use, Donate) and the admin panel UI. The client must never query Supabase directly and must not contain critical business logic (e.g., status transition rules, deletion-on-refusal logic, report generation logic). All such logic resides in the backend.

**Node.js REST API:** Acts as the sole intermediary between the client and Supabase. Exposes REST endpoints organized into controllers, services, repositories, DTOs, and validators. Enforces authentication/authorization, validation, and all business rules described in this document (e.g., automatic deletion of refused/not-confirmed records, status lifecycle transitions, report filtering).

**Supabase:** Used as Database (storing projects, volunteers, support requests, donations, partners, team members, beneficiary stories, and the single administrator account), Auth (administrator authentication), and Storage (project cover images, galleries, partner logos, team photos).

**Data flow:** The React client sends HTTP requests to the Node.js REST API. The API validates, authorizes, and applies business rules, then reads/writes to Supabase. Supabase never receives requests directly from the client.

---

# Frontend Requirements

### Pages
- Home (`/inicio` — the root route always redirects here)
- About Us ("Quem Somos") — history, mission, vision, values
- What We Do — activities by pillar
- Highlights (list) and Highlight/Project Detail page
- Contacts (with sub-tabs/sections: general contact info, "request support" form, "become volunteer" form)
- Location
- Donate (cause selection, amount, payment method, confirmation, thank-you screen)
- Terms of Use
- Admin Login (`/admin`)
- Admin Panel (with tabs: Projects, Volunteers, Support Requests, Beneficiary Stories, Partners, Team, Donations)

### Components
- Navigation menu (public pages only; no visible link to `/admin`)
- Highlight/Project card and detail view
- Contact channel links/icons (Email, WhatsApp, Facebook, Instagram)
- Support request form
- Volunteer application form
- Donation flow components (cause selector, amount input, payment method selector, payment instruction display, confirmation/thank-you screen)
- Admin data tables/lists with date-range filters (Volunteers, Support Requests, Donations)
- Admin status-change controls (e.g., approve/refuse, confirm/not confirm)
- Project create/edit form (name, objectives, status, cover image, image/video gallery, responsible team)
- Partner and Team member management forms (name, logo/photo, role/bio)
- Beneficiary story management form (associated with a concluded project)
- PDF report export control with date-range input

### Layouts
- Public site layout (header/navigation, footer with contact links)
- Admin panel layout (tabbed/sectioned interface, logout/exit action)

### Forms
- Support/tracking request form (name, email, phone, gender, date of birth, address, type of special need, description)
- Volunteer application form (personal data, area of interest, chosen activity)
- Donation form (cause, amount, payment method)
- Admin login form (email, password)
- Project form, Partner form, Team form, Beneficiary story form (admin)

### Navigation
- Public navigation does not expose a link to the admin route.
- Root route always redirects to the Home page.

### State Management
*Not specified in the PDF — left for the implementing team to choose consistent with the architecture; see Open Questions.*

### Authentication Flow
- Administrator accesses `/admin`, sees a login form, submits email and password, and on success enters the admin panel. A logout ("Sair"/exit) action ends the session.

### Error Handling
- Forms must provide feedback on submission (e.g., the donation flow shows a thank-you screen on success). Specific error-message requirements beyond this are not detailed in the PDF; see Open Questions.

---

# Backend Requirements

### Controllers
- AuthController (admin login/logout)
- ProjectController
- VolunteerController
- SupportRequestController
- DonationController
- PartnerController
- TeamController
- StoryController
- ReportController

### Services
- AuthService (credential validation, session handling)
- ProjectService (CRUD, lifecycle state transitions: planning → in progress → concluded)
- VolunteerService (status transitions; permanent deletion on refusal)
- SupportRequestService (status transitions; permanent deletion on refusal)
- DonationService (status transitions; permanent deletion when marked Not Confirmed; period total calculation)
- PartnerService (add/remove)
- TeamService (CRUD)
- StoryService (CRUD; association with a concluded project)
- ReportService (PDF generation filtered by date range, covering support requests, volunteer applications, and donations)

### Routes
REST routes exposing the above resources (see API Endpoints section).

### DTOs
DTOs for: Project, Volunteer Application, Support Request, Donation, Partner, Team Member, Beneficiary Story, Admin Login credentials, Report request (date range).

### Validators
Validation layer for all form inputs listed under Frontend Requirements (e.g., required fields for support requests and volunteer applications, valid date ranges for reports/filters, valid status values for transitions).

### Middleware
- Authentication middleware protecting all admin-only endpoints.
- Authorization middleware ensuring only the administrator can access management endpoints (no multi-role system exists).

### Authentication
Single fixed administrator account, authenticated by email and password, with session control (RNF-01).

### Authorization
Binary model only: authenticated Administrator vs. unauthenticated Visitor. There are no multiple administrator accounts or permission levels (explicitly stated as not supported).

---

# Database Requirements

```markdown
Entity: Project
Purpose: Represents a social project run by ALEM, shown publicly under Highlights and used as a donation cause.
Fields: name, objectives, status (Planning | In Progress | Concluded), cover image, gallery (images/videos), responsible team
Relationships: Has many Beneficiary Stories (a story is associated with a concluded project); referenced by Donations (selected cause)
Constraints: status must follow defined lifecycle transitions (Planning → In Progress → Concluded); exact transition rules not detailed in the PDF (see Open Questions)
```

```markdown
Entity: Volunteer Application
Purpose: Represents a candidacy submitted by a prospective volunteer.
Fields: personal data, area of interest, chosen activity, status (Pending | Approved | Refused), read flag, submission date
Relationships: None specified
Constraints: Always created with status Pending; record is permanently deleted if status becomes Refused (no history kept)
```

```markdown
Entity: Support Request (Tracking Request)
Purpose: Represents a request for tracking/support submitted by a beneficiary with special needs.
Fields: name, email, phone, gender, date of birth, address, type of special need, description, status (Pending | Approved | Refused), submission date
Relationships: None specified
Constraints: Always created with status Pending; record is permanently deleted if status becomes Refused (no history kept)
```

```markdown
Entity: Donation
Purpose: Represents a donation declared by a donor (no real payment processing occurs).
Fields: selected cause/project (or general option), amount, payment method (M-Pesa | Bank Transfer/IBAN | Card), status (Pending | Confirmed | Not Confirmed), submission date
Relationships: References a Project (cause) or general/no specific project
Constraints: Always created with status Pending; record is deleted from the admin panel if status becomes Not Confirmed; payment confirmation is performed manually outside the system
```

```markdown
Entity: Partner
Purpose: Represents an organization or entity partnered with ALEM.
Fields: name, logo/photo
Relationships: None specified
Constraints: Added and removed only by the Administrator
```

```markdown
Entity: Team Member
Purpose: Represents a member of ALEM's team, shown publicly.
Fields: name, photo, role/bio
Relationships: May be referenced as "responsible team" on a Project
Constraints: Managed (create/edit/publish/remove) only by the Administrator
```

```markdown
Entity: Beneficiary Story
Purpose: Represents a published success story of a beneficiary.
Fields: story content
Relationships: Associated with a concluded Project
Constraints: Published directly by the Administrator; must be linked to a Project with status Concluded
```

```markdown
Entity: Administrator
Purpose: The single, fixed account with access to the management panel.
Fields: email, password
Relationships: None
Constraints: Only one account exists; no multiple admin users or permission levels; no action audit/history is kept
```

---

# API Endpoints

```markdown
POST /auth/login
Purpose: Authenticate the administrator and start a session.
Request: { email, password }
Response: { session/token } or authentication error
Validation: Required fields; valid credential format
Authorization: Public (this is the entry point to authentication)
```

```markdown
POST /auth/logout
Purpose: End the administrator session.
Request: None (uses active session)
Response: Confirmation of logout
Validation: None
Authorization: Authenticated Administrator
```

```markdown
GET /projects
Purpose: List projects (public, for Highlights; includes dynamic list for donation cause selection).
Request: Optional query filters
Response: List of project records
Validation: None
Authorization: Public
```

```markdown
GET /projects/:id
Purpose: Retrieve project detail page content.
Request: Project ID
Response: Single project record
Validation: ID must exist
Authorization: Public
```

```markdown
POST /projects
Purpose: Create a new project.
Request: { name, objectives, status, coverImage, gallery, responsibleTeam }
Response: Created project record
Validation: Required fields present; status within allowed lifecycle values
Authorization: Authenticated Administrator
```

```markdown
PUT /projects/:id
Purpose: Edit an existing project, including lifecycle status transitions.
Request: Updated project fields
Response: Updated project record
Validation: Status transition must follow the defined project lifecycle (Planning → In Progress → Concluded)
Authorization: Authenticated Administrator
```

```markdown
DELETE /projects/:id
Purpose: Delete a project.
Request: Project ID
Response: Deletion confirmation
Validation: ID must exist
Authorization: Authenticated Administrator
```

```markdown
POST /support-requests
Purpose: Submit a beneficiary tracking/support request.
Request: { name, email, phone, gender, dateOfBirth, address, needType, description }
Response: Created request record (status Pending)
Validation: Required fields present
Authorization: Public
```

```markdown
GET /support-requests
Purpose: List support requests for administration, with date-range filtering.
Request: Optional startDate, endDate
Response: List of support request records
Validation: Valid date range if provided
Authorization: Authenticated Administrator
```

```markdown
PATCH /support-requests/:id/status
Purpose: Change the status of a support request.
Request: { status: "Approved" | "Refused" }
Response: Updated record, or deletion confirmation if Refused
Validation: Status must be one of the allowed values
Authorization: Authenticated Administrator
Business Rule: If status is set to Refused, the record is permanently deleted (no history retained)
```

```markdown
POST /volunteer-applications
Purpose: Submit a volunteer application.
Request: { personalData, areaOfInterest, chosenActivity }
Response: Created application record (status Pending)
Validation: Required fields present
Authorization: Public
```

```markdown
GET /volunteer-applications
Purpose: List volunteer applications for administration, with date-range filtering.
Request: Optional startDate, endDate
Response: List of application records
Validation: Valid date range if provided
Authorization: Authenticated Administrator
```

```markdown
PATCH /volunteer-applications/:id/read
Purpose: Mark a volunteer application as read.
Request: Application ID
Response: Updated record
Validation: ID must exist
Authorization: Authenticated Administrator
```

```markdown
PATCH /volunteer-applications/:id/status
Purpose: Change the status of a volunteer application.
Request: { status: "Approved" | "Refused" }
Response: Updated record, or deletion confirmation if Refused
Validation: Status must be one of the allowed values
Authorization: Authenticated Administrator
Business Rule: If status is set to Refused, the record is permanently deleted
```

```markdown
POST /donations
Purpose: Submit a donation declaration.
Request: { cause/projectId (optional, general allowed), amount, paymentMethod }
Response: Created donation record (status Pending) and payment instructions
Validation: Required fields present; valid payment method
Authorization: Public
```

```markdown
GET /donations
Purpose: List donations for administration, with date-range filtering and period total.
Request: Optional startDate, endDate
Response: List of donation records and total amount for the period
Validation: Valid date range if provided
Authorization: Authenticated Administrator
```

```markdown
PATCH /donations/:id/status
Purpose: Change the status of a donation.
Request: { status: "Confirmed" | "Not Confirmed" }
Response: Updated record, or deletion confirmation if Not Confirmed
Validation: Status must be one of the allowed values
Authorization: Authenticated Administrator
Business Rule: If status is set to Not Confirmed, the record is deleted from the admin panel
```

```markdown
POST /partners
Purpose: Add a partner.
Request: { name, logo }
Response: Created partner record
Validation: Required fields present
Authorization: Authenticated Administrator
```

```markdown
DELETE /partners/:id
Purpose: Remove a partner.
Request: Partner ID
Response: Deletion confirmation
Validation: ID must exist
Authorization: Authenticated Administrator
```

```markdown
GET /partners
Purpose: List partners (public display).
Request: None
Response: List of partner records
Validation: None
Authorization: Public
```

```markdown
POST /team
Purpose: Create a team member.
Request: { name, photo, roleBio }
Response: Created team member record
Validation: Required fields present
Authorization: Authenticated Administrator
```

```markdown
PUT /team/:id
Purpose: Edit a team member.
Request: Updated fields
Response: Updated record
Validation: ID must exist
Authorization: Authenticated Administrator
```

```markdown
DELETE /team/:id
Purpose: Remove a team member.
Request: Team member ID
Response: Deletion confirmation
Validation: ID must exist
Authorization: Authenticated Administrator
```

```markdown
GET /team
Purpose: List team members (public display).
Request: None
Response: List of team member records
Validation: None
Authorization: Public
```

```markdown
POST /stories
Purpose: Create a beneficiary story.
Request: { content, projectId }
Response: Created story record
Validation: projectId must reference a project with status Concluded
Authorization: Authenticated Administrator
```

```markdown
PUT /stories/:id
Purpose: Edit/publish a beneficiary story.
Request: Updated fields, publish flag
Response: Updated record
Validation: ID must exist
Authorization: Authenticated Administrator
```

```markdown
DELETE /stories/:id
Purpose: Remove a beneficiary story.
Request: Story ID
Response: Deletion confirmation
Validation: ID must exist
Authorization: Authenticated Administrator
```

```markdown
GET /stories
Purpose: List published beneficiary stories (public display).
Request: None
Response: List of story records
Validation: None
Authorization: Public
```

```markdown
POST /highlights
Purpose: Create a highlight/publication.
Request: Highlight content
Response: Created highlight record
Validation: Required fields present
Authorization: Authenticated Administrator
```

```markdown
PUT /highlights/:id
Purpose: Edit/publish a highlight.
Request: Updated fields, publish flag
Response: Updated record
Validation: ID must exist
Authorization: Authenticated Administrator
```

```markdown
DELETE /highlights/:id
Purpose: Remove a highlight.
Request: Highlight ID
Response: Deletion confirmation
Validation: ID must exist
Authorization: Authenticated Administrator
```

```markdown
GET /highlights
Purpose: List published highlights/publications (public display), including project detail content.
Request: None
Response: List of highlight records
Validation: None
Authorization: Public
```

```markdown
GET /reports?startDate=&endDate=
Purpose: Generate a PDF report of support requests, volunteer applications, and donations within a date range.
Request: startDate, endDate
Response: PDF file
Validation: Valid date range required
Authorization: Authenticated Administrator
```

---

# Authentication & Authorization

**Login:** The Administrator accesses the `/admin` route (public route, not linked in normal navigation) and submits email and password through a login form.

**Logout:** The Administrator ends the session through an exit/"Sair" action in the admin panel.

**Registration:** Not applicable — there is no self-registration; only one fixed administrator account exists, and the system does not support creating additional administrator accounts.

**Password Recovery:** Not specified in the PDF (see Open Questions).

**Session Handling:** The admin panel access must be protected by an authentication system with session control (RNF-01). Specific session duration/expiry rules are not specified in the PDF.

**Roles:** Two implicit roles only — Visitor (unauthenticated) and Administrator (authenticated). No additional roles or permission levels exist.

**Permissions:**
- Visitor: view all public content; submit support requests, volunteer applications, and donations. Cannot edit/delete/view internal status of others' submissions; cannot access management areas; cannot alter the status of their own submitted request.
- Administrator: create/edit/delete projects, partners, team members, and beneficiary stories; view and change status of volunteer applications, support requests, and donations; refuse applications/requests/donations; query and export (PDF) donation records by date. Cannot recover a refused application or message (permanent deletion); cannot manage other administrator accounts (only one fixed account, no multi-admin/permission-level system); cannot view a history/audit log of administrative actions (no action log exists).

---

# Validation Rules

- Support request form: name, email, phone, gender, date of birth, address, type of special need, and description must be provided.
- Volunteer application form: personal data, area of interest, and chosen activity must be provided.
- Donation form: cause/project selection (or general option), amount, and payment method must be provided.
- Admin login: email and password are required for authentication.
- Status fields are constrained to their defined enumerations: Support Requests and Volunteer Applications → Pending, Approved, Refused; Donations → Pending, Confirmed, Not Confirmed; Projects → Planning, In Progress, Concluded.
- Report generation requires a valid start date and end date.
- Beneficiary stories must be associated with a project whose status is Concluded.

*The PDF does not specify field-level formats (e.g., email regex, phone format, minimum/maximum values for donation amount). See Open Questions.*

---

# UI/UX Requirements

**Flows:**
- Visitor flow: landing on Home (root redirects to `/inicio`) → free navigation across Home, About Us, What We Do, Highlights (with project detail), Contacts, Location → optional donation flow or optional support-request/volunteer-application submission via Contacts tabs.
- Administrator flow: login at `/admin` → tabbed panel (Projects, Volunteers, Support Requests, Beneficiary Stories, Partners, Team, Donations) → perform management actions → logout.

**Navigation:** No visible link to the admin route in the public navigation menu; the root route always redirects to the Home page.

**Responsiveness:** Required across mobile, tablet, and desktop (RF-08).

**Feedback Visual:** A thank-you screen is shown after a donation is submitted. Other forms (support request, volunteer application) are described as resulting in a "pending" saved record, implying confirmation feedback, though exact UI feedback content beyond this is not detailed.

**Loading States:** Not specified in the PDF.

**Empty States:** Not specified in the PDF.

**Error Handling:** Not detailed beyond the requirement that submissions be validated and persisted; specific error message content/format is not specified in the PDF.

---

# Security Requirements

**Authentication:** Single administrator account; access to the admin panel protected by credentials and session control (RF-10, RNF-01).

**Authorization:** Two-tier model (Visitor / Administrator) with no granular permission levels; administrative endpoints must be restricted to the authenticated Administrator only.

**Input Validation:** All public submission forms (support request, volunteer application, donation) must be validated server-side per the Validation Rules section.

**Rate Limiting:** Not specified in the PDF (see Open Questions).

**Data Protection:** Personal data of beneficiaries, volunteers, and donors must be stored with encryption and access control (RNF-05).

**OWASP Considerations:** Not explicitly detailed in the PDF; general secure-by-default practices (e.g., protecting against injection, ensuring the frontend never directly accesses Supabase) should be followed per the mandated architecture, but no specific OWASP controls are itemized in the source document. See Open Questions.

---

# Gap Analysis

*This section must be completed by the executing AI agent after inspecting the actual codebase. No existing project code was provided alongside this instruction document at the time of writing. The agent must:*

1. Inventory the current codebase structure (client/server separation, use of controllers/services/repositories/DTOs/validators).
2. Verify whether the frontend performs direct Supabase queries or contains business logic that should be migrated to the backend (architectural violation per the mandated React → Node.js → Supabase flow).
3. Cross-check each Functional Requirement (FR-001 through FR-016) against implemented features and flag: **Missing Features** (requirement not implemented), **Incorrect Implementations** (implemented but not matching described behavior, e.g., refusal not resulting in permanent deletion), **Architectural Problems** (e.g., direct client-to-Supabase calls, missing REST layering), and **Technical Debt** (e.g., missing validation layer, missing DTOs).
4. Document findings under this section once the codebase has been analyzed.

---

# Implementation Roadmap

```markdown
Phase 1 — Architecture & Foundation
Tasks:
- Establish client/server separation (React client, Node.js REST API).
- Scaffold backend structure: controllers, services, repositories, routes, middlewares, validators, dto, utils, config.
- Configure Supabase connection (Database, Auth, Storage) accessible only from the backend.
- Implement Administrator authentication (single fixed account) with session control.
Dependencies: None.
Expected Deliverables: Working backend skeleton with authenticated admin login; Supabase connected only through the API.
```

```markdown
Phase 2 — Public Content Features
Tasks:
- Implement Home, About Us, What We Do, Highlights (list + detail), Contacts, Location, Terms of Use pages.
- Implement public read endpoints for Projects, Highlights, Partners, Team, Stories.
Dependencies: Phase 1.
Expected Deliverables: Fully navigable public site driven by backend data.
```

```markdown
Phase 3 — Visitor Submission Features
Tasks:
- Implement Support Request submission (form + endpoint + Pending status).
- Implement Volunteer Application submission (form + endpoint + Pending status).
- Implement Donation flow (cause selection, amount, payment method instructions, Pending donation record, thank-you screen).
Dependencies: Phase 1, Phase 2 (for project list used as donation causes).
Expected Deliverables: Visitors can submit support requests, volunteer applications, and donations.
```

```markdown
Phase 4 — Administration Features
Tasks:
- Implement Project management (create/edit/delete, lifecycle status transitions).
- Implement Volunteer Application management (list, filter by date, mark as read, status transition with deletion-on-refusal).
- Implement Support Request management (list, filter, status transition with deletion-on-refusal).
- Implement Donation management (list, filter, period total, status transition with deletion-on-not-confirmed).
- Implement Partner and Team management (CRUD).
- Implement Beneficiary Story management (CRUD, association with Concluded projects).
Dependencies: Phase 1, Phase 2, Phase 3.
Expected Deliverables: Fully functional admin panel covering all management tabs described in the PDF.
```

```markdown
Phase 5 — Reporting
Tasks:
- Implement PDF report generation endpoint covering support requests, volunteer applications, and donations, filtered by start/end date.
- Implement frontend export control in the admin panel.
Dependencies: Phase 4.
Expected Deliverables: Administrator can generate and download filtered PDF reports.
```

```markdown
Phase 6 — Non-Functional Hardening
Tasks:
- Verify and enforce accessibility (ARIA labels, keyboard navigation, screen-reader support) across all pages.
- Verify responsiveness across mobile, tablet, desktop.
- Apply encryption/access control to personal data at rest (Supabase configuration).
- Review session handling and data integrity safeguards.
Dependencies: Phases 1–5.
Expected Deliverables: System satisfying RNF-01 through RNF-05.
```

---

# AI Execution Rules

1. Analyze the entire existing codebase before making any changes.
2. Do not remove existing functionality without documented justification tied to a requirement in this document.
3. Preserve valid business rules exactly as specified (e.g., permanent deletion on refusal/non-confirmation; Pending-by-default record creation; project lifecycle states).
4. Refactor only when necessary to align with the mandated architecture or to fix an identified gap.
5. Follow the mandated architecture strictly: React Client → Node.js REST API → Supabase. The frontend must never query Supabase directly and must not contain critical business logic.
6. Prioritize REST API design using controllers, services, repositories, DTOs, and a validation layer.
7. Correct any inconsistencies found between the current implementation and the Functional/Non-Functional Requirements listed in this document.
8. Implement any functionality described in this document that is missing from the current codebase.
9. Keep the codebase scalable, anticipating growth in content volume (RNF-02).
10. Keep the code clean and modular.
11. Follow SOLID principles.
12. Follow Clean Architecture principles where applicable.
13. Produce production-ready code.
14. Do not invent requirements, business rules, or features beyond what is documented here or explicitly confirmed by the user; flag ambiguities under Open Questions instead of assuming.

---

# Open Questions

1. The PDF does not specify exact transition rules between project lifecycle states (Planning → In Progress → Concluded) — e.g., whether transitions can be skipped, reversed, or are strictly sequential.
2. No password recovery flow is described for the Administrator account.
3. No specific field-level validation formats (email pattern, phone format, minimum/maximum donation amount, date format) are specified.
4. No specific rate-limiting requirements are described.
5. No specific OWASP controls are itemized beyond the general data-security and authentication requirements (RNF-01, RNF-05).
6. No loading-state or empty-state UI requirements are described.
7. No detailed error-message content/format requirements are described for any form.
8. State management approach for the React client is not specified.
9. The exact mechanism by which the Administrator is notified of new submissions (support requests, volunteer applications, donations) is not specified beyond manual review in the panel.
10. The PDF states response to beneficiaries/volunteers happens via phone, email, or WhatsApp, but does not specify whether this communication is logged or tracked within the system.
11. No session expiry/timeout duration is specified for the Administrator session.
12. The existing codebase was not provided alongside this requirements document; the Gap Analysis section cannot be completed until the AI agent inspects the actual project files.
