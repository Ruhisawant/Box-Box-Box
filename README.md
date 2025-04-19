# Web Development Project 7 - **Box-Box-Box**

Submitted by: **Ruhi Sawant**

This web app: **Box-Box-Box** is a Formula 1-themed team management platform where users can create, view, update, and delete crewmate profiles representing members of an F1 team—like engineers, drivers, strategists, and more. Each member includes role-based styling and custom attributes to simulate real pit crew roles.

Time spent: **25** hours spent in total

---

## ✅ Required Features

The following **required** functionality is completed:

- [x] **The web app contains a page that features a create form to add a new crewmate**
  - Users can name the crewmate
  - Users can set the crewmate’s attributes by clicking on one of several values

- [x] **The web app includes a summary page of all the user’s added crewmates**
  - Displays all crewmates the user has made so far
  - Sorted by creation date (newest at the top)

- [x] **A previously created crewmate can be updated from the list**
  - Each crewmate has an edit button that links to an update form
  - The update form displays current values and reflects changes immediately

- [x] **A previously created crewmate can be deleted**
  - Delete button available on the edit form
  - Deleted crewmates are removed from the summary

- [x] **Each crewmate has a direct, unique URL link to an info page about them**
  - Summary page links to a detail page for each crewmate
  - The detail page contains additional data
  - Users can navigate to the edit form from the detail page

---

## ✨ Optional Features

The following **optional** features are implemented:

- [x] A crewmate can be given a category (e.g., "Driver", "Engineer", etc.) that affects the available attribute options
- [x] Summary page includes crew statistics (e.g., how many team members are in each role)
- [x] Crew success score is calculated dynamically and reflected visually in the crewmate list (e.g., performance rating based on team balance)

---

## 🚀 Additional Features

- [x] **Role-based Styling:** Each crewmate’s role changes the background color with a gradient effect using dynamic class mappings (e.g., `icon-driver`, `icon-engineer`, etc.)
- [x] **Supabase Integration:** All data is stored and managed in Supabase with real-time syncing
- [x] **Responsive UI:** Built with `shadcn/ui` components and `lucide-react` icons for a modern, clean layout
- [x] **Routing:** Fully functional routing with React Router to support create/edit/detail page views

---

## 🎥 Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='/src/assets/walkthrough.gif' title='Video Walkthrough' width='100%' alt='Video Walkthrough' />

GIF created with [AdobeExpress](https://www.adobe.com/express/feature/video/convert/mov-to-gif)

---

## 🧠 Notes

**Challenges Encountered:**
- Styling role-based badges dynamically using CSS classes and JSX logic
- Structuring Supabase tables to manage attributes based on roles
- Managing React Router paths and state across detail/edit forms

---

## 📄 License

```
Copyright 2025 Ruhi Sawant

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0
```