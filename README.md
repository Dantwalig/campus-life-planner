# Campus Life Planner

A responsive, accessible web application for managing campus tasks and events. Built with vanilla HTML, CSS, and JavaScript—no frameworks, no dependencies.

**Live Demo:** https://Dantwalig.github.io/campus-life-planner/

**Figma Design:** [View Design Mockups](https://www.figma.com/design/3rr9UMgkjUeAS2JQXtoF8C/Untitled?node-id=0-1&t=QBE1nG5NG0jLGDPU-1)

**Demo Video:** [Watch My Demo](https://youtu.be/DdW-qhaprmY) *(shows keyboard navigation, regex search, import/export, stats, settings, mobile responsiveness)*

---

## Features

- Create, edit, and delete tasks/events with full CRUD operations
- Duration tracking in HH:MM format with configurable units
- Tag-based organization (comma-separated, Unicode support including emoji)
- Real-time regex search with safe pattern compilation and match highlighting
- Sort by date, title, or duration
- JSON import/export with strict validation
- localStorage persistence across browser sessions
- Weekly duration cap with ARIA assertive alerts when exceeded
- Full keyboard navigation with shortcuts (n, Ctrl+S, Enter, d)
- ARIA live regions, semantic HTML, and skip-to-content link
- Mobile-first responsive design (tested at 360px, 768px, 1024px)
- Settings page for unit configuration and cap management
- Comprehensive test suite (tests.html with 25+ regex test cases)

---

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/Dantwalig/campus-life-planner.git
cd campus-life-planner
```

2. Open in browser:
```bash
# Direct open
open index.html

# Or start a local server
python -m http.server 8000
# Visit: http://localhost:8000
```

3. No build process required—100% vanilla JavaScript (ES modules).

---

## Core Pages & Sections

### Dashboard
- Quick stats display: total tasks, tasks this week, top tag, total duration
- Weekly cap alert (shows when exceeded with ARIA assertive message)

### Create/Edit Form
- Title, description, date/time (datetime-local picker), duration (HH:MM), tags
- Real-time validation feedback on all fields
- Clear error messages below each input
- Form actions: Save (Ctrl+S) and Cancel

### Task/Event List
- Card-based display (responsive: 1 col mobile, 2 col tablet, 3 col desktop)
- Each item shows: title, date, description, tags, edit/delete buttons
- Click item or press Enter to edit; press d or Delete to remove
- Live search highlighting as you type

### Settings Modal
- **Duration Units:** Toggle between "Hours & Minutes" and "Total Minutes"
- **Weekly Cap:** Set a numeric cap in minutes (e.g., 1800 for 30 hours)
- Cap alerts trigger when exceeded (ARIA live="assertive" for screen readers)
- Settings persisted to localStorage

---

## Data Model

Each record has this structure:
```json
{
  "id": "item_abc123",
  "title": "Web Development Assignment",
  "description": "Complete the campus planner project",
  "date": "2025-10-17T23:59",
  "duration": "02:00",
  "tags": ["assignment", "webdev", "urgent"],
  "createdAt": "2025-10-08T12:00:00.000Z",
  "updatedAt": "2025-10-15T18:30:00.000Z"
}
```

All records auto-save to localStorage. Unique `id` and timestamps are required.

---

## Regex Validation Catalog

This app implements 6 regex patterns with comprehensive validation, including one advanced pattern (back-reference for duplicate detection).

### 1. Title Validation (Advanced - Lookahead)
**Pattern:** `/^(?=.{2,})(?!\s+$).+/`

Uses positive and negative lookahead to ensure:
- At least 2 characters long: `(?=.{2,})`
- Not just whitespace: `(?!\s+$)`

Examples:
- Valid: "CS 101", "Meeting", "OK"
- Invalid: "a" (too short), "   " (whitespace only)

### 2. Duration Format (HH:MM)
**Pattern:** `/^([0-9]{1,2}):([0-5][0-9])$/`

Validates hours (0-99) and minutes (00-59):
- Hours: 1-2 digits `[0-9]{1,2}`
- Minutes: 2 digits, 00-59 `[0-5][0-9]`

Examples:
- Valid: "01:30", "2:45", "48:00"
- Invalid: "1:60" (invalid minutes), "ab:cd" (non-numeric)

### 3. Date/Time (ISO Format)
**Pattern:** `/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/`

Validates ISO 8601 datetime-local format (YYYY-MM-DDTHH:MM):

Examples:
- Valid: "2025-10-17T14:30", "2025-01-01T00:00"
- Invalid: "2025-10-17" (missing time), "2025/10/17T14:30" (wrong date format)

### 4. Tag Format (Unicode Support)
**Pattern:** `/^[\p{L}\p{N}\p{Emoji}_-]{1,30}$/u`

Unicode-aware validation supporting:
- Letters: `\p{L}` (any language)
- Numbers: `\p{N}`
- Emoji: `\p{Emoji}`
- Special chars: underscore (_) and hyphen (-)
- Max 30 characters per tag

Examples:
- Valid: "urgent", "CS101", "office_hour", "mid-term", "🎯"
- Invalid: "tag with space" (spaces not allowed), "tag@invalid" (special char)

### 5. Duplicate Tag Detection (Back-Reference)
**Pattern:** `/\b(\w+)\b(?=.*\b\1\b)/`

Advanced pattern using back-reference to detect repeated words:
- Captures word: `(\w+)`
- Lookahead checks if word repeats later: `(?=.*\b\1\b)`

Examples:
- Invalid: "urgent urgent", "the the project"
- Valid: "urgent important", "meeting today"

### 6. Safe Regex Compiler (Prevents Catastrophic Backtracking)
**Pattern:** `/(\.\*){3,}|(\(\?:.*\|\.*\))/u`

Blocks dangerous user input patterns:
- Triple wildcard: `.*.*.*` (causes exponential backtracking)
- Unsafe alternation: `(?:.*|.*)` (similar issue)

Search uses safe compilation with try/catch; invalid patterns show error message.

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `n` | Create new task/event |
| `Ctrl+S` / `Cmd+S` | Save current form |
| `Enter` (on list item) | Edit selected item |
| `Delete` or `d` (on item) | Delete selected item |
| `Tab` | Navigate forward through fields |
| `Shift+Tab` | Navigate backward through fields |
| `Esc` | Close settings modal |

All shortcuts work without mouse. Form fields, buttons, and list items are fully keyboard accessible.

---

## Accessibility (a11y)

### Semantic Markup
- Proper landmark regions: `<header>`, `<nav>`, `<main>`, `<footer>`, `<aside>`
- Heading hierarchy: H1 (app title) → H2 (section titles)
- Form labels associated with inputs via `for`/`id`
- Semantic list structure (`<ul>`/`<li>`)

### ARIA Implementation
- **Roles:** `role="banner"`, `role="navigation"`, `role="main"`, `role="contentinfo"`, `role="status"`, `role="alert"`
- **Labels:** All buttons, inputs, and selects have descriptive `aria-label`
- **Live Regions:** 
  - `aria-live="polite"` for normal announcements (form submissions, item counts)
  - `aria-live="assertive"` for urgent alerts (cap exceeded)
  - `aria-atomic="true"` ensures full message is announced
- **Form Descriptions:** `aria-describedby` links to hint text
- **Dialog:** `<dialog>` element with proper backdrop for settings modal

### Keyboard Navigation
- Skip link at top jumps to main content (visible on focus)
- All interactive elements reachable via Tab
- No keyboard traps; modal can be closed with Escape
- Focus indicators: 2px solid outline with 2px offset (visible on all browsers)
- List items focusable with `tabindex="0"`

### Screen Reader Support
- Live announcements for: form submissions, deletions, search results, cap alerts
- Alternative text for logo (`alt` attribute)
- Error messages marked with `role="alert"`
- Status updates announced via live regions

### Visual Accessibility
- Color contrast: All text meets WCAG AA standard (4.5:1 for normal text, 3:1 for large text)
- Focus indicators: Clearly visible 2px outline on all interactive elements
- Reduced motion support: Respects `prefers-reduced-motion` media query; animations disabled for users who opt in
- Scalable text: Uses `rem`/`em` units; supports browser zoom up to 200%
- Color not sole indicator: Errors use text + icon, alerts use text + color

---

## Testing

### Run Validation Tests
Open `tests.html` in your browser to run the regex test suite:
```
tests.html
```

This file contains:
- 6 regex pattern test suites
- 25+ edge case test scenarios
- Visual pass/fail indicators (green ✓ / red ✗)
- Pattern documentation inline
- Live test counter

All tests should show ✓ PASS.

### Manual Testing Checklist

1. **Form Validation:**
   - Submit with empty title → error appears below field
   - Enter "a" as title → "must be at least 2 characters" error
   - Enter "1:60" as duration → "must be HH:MM format" error
   - Add duplicate tags (e.g., "urgent, urgent") → duplicate warning
   - Try invalid tag format → format error appears

2. **CRUD Operations:**
   - Create new task → appears in list with correct date/time
   - Edit existing item → changes persist after refresh
   - Delete item → removed from list and localStorage
   - All changes reflected in stats dashboard

3. **Search & Regex:**
   - Search "^CS" → filters items starting with CS, highlights matches
   - Search "\\d+" → shows items with numbers highlighted
   - Search "[aeiou]" → filters items with vowels
   - Try invalid regex → graceful error message

4. **Import/Export:**
   - Click Export → JSON file downloads
   - Edit JSON in text editor (add/remove items)
   - Click Import → select edited file → items merge with existing data
   - Verify invalid JSON rejected with error message

5. **Settings & Cap:**
   - Click Settings → modal opens
   - Toggle duration unit → setting persists after refresh
   - Set cap to 1800 minutes → add items until total exceeds cap
   - Cap exceeded alert appears with ARIA live region announcement
   - Refresh page → cap setting preserved

6. **Keyboard Navigation:**
   - Press `n` → form receives focus, title field active
   - Tab through all form fields → all reach keyboard focus
   - Fill form, press `Ctrl+S` → item saves
   - Press Tab to list item → press Enter → item enters edit mode
   - Press `d` on item → delete confirmation dialog appears
   - All operations work without mouse

7. **Responsive Design:**
   - Open DevTools, set viewport to 360px width → single column layout
   - Resize to 768px → two-column layout
   - Resize to 1024px → three-column layout
   - Stats grid: 1 col (mobile), 2 col (tablet), 4 col (desktop)
   - No horizontal scrolling; all content visible
   - Touch targets (buttons) at least 44px on mobile

8. **Accessibility Audit:**
   - Run axe DevTools browser extension → no critical violations
   - Test with NVDA (Windows) or VoiceOver (macOS) → all content readable
   - Test with keyboard only → all features accessible
   - Check color contrast using browser contrast checker → WCAG AA met

---

## Project Structure

```
campus-life-planner/
├── index.html                    # Main app file
├── tests.html                    # Regex test suite
├── seed.json                     # 10 sample records
├── README.md                     # This file
├── .gitignore
├── styles/
│   ├── base.css                 # Global styles, typography, forms
│   ├── layout.css               # Responsive grid, breakpoints
│   └── animations.css           # Transitions, animations
├── scripts/
│   ├── main.js                  # Entry point, event handlers
│   ├── storage.js               # localStorage operations
│   ├── state.js                 # App state management
│   ├── ui.js                    # DOM rendering & updates
│   ├── validation.js            # Form validation & regex
│   └── search.js                # Filtering & search logic
└── assets/
    └── Campus life planner Logo.png
```

All modules use ES6 imports; no build step required.

---

## Technical Details

### Data Persistence
- **Auto-save:** Every action (create, update, delete) saves to localStorage immediately
- **Key:** `campus:items` for task data, `app:settings` for user settings
- **Validation:** Strict type checking on load; malformed data discarded
- **Quota:** ~5-10MB per domain; exceeding quota handled with try/catch

### Regular Expressions
- **Compilation:** User search patterns compiled with try/catch; invalid patterns return null
- **Flags:** Unicode mode (`u`) enabled for emoji/Unicode character support; case-insensitive (`i`) for search
- **Safety:** Catastrophic backtracking patterns detected and blocked
- **Highlighting:** Matches wrapped in `<mark>` tags; color contrast verified

### Responsive Design
- **Mobile-first:** All styles default to mobile; media queries add tablet/desktop enhancements
- **Breakpoints:**
  - Small (360px–767px): Single column, full-width inputs
  - Tablet (768px–1023px): Two columns, responsive nav
  - Desktop (1024px+): Three columns, centered container max-width
- **Flexbox & Grid:** Modern layout techniques; no vendor prefixes needed
- **Animations:** Fade-in, slide-down, pulse effects with 0.2–0.3s duration; disabled for `prefers-reduced-motion`

### Browser Compatibility
- Modern browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- ES6 modules required (no transpilation)
- localStorage and CSS Grid required
- Unicode regex (`\p{}` syntax) requires modern engine

---

## Known Limitations

1. **No Backend:** All data stored client-side in localStorage (browser-specific)
2. **Single Device:** No synchronization across devices or browsers
3. **Storage Limit:** ~5-10MB localStorage limit per domain
4. **No Authentication:** All data is unencrypted and accessible
5. **Desktop-only Deploy:** GitHub Pages only; no Netlify/Heroku

---

## Design System

### Color Palette
- **Background:** `#2b2d42` (Dark navy)
- **Accent:** `#f9e71e` (Bright yellow for CTAs)
- **Text:** `#ffffff` (White for primary, `#ccc` for secondary)
- **Borders:** `#3a3d52` (Subtle separators)
- **Input BG:** `#e8e8e8` (Light gray for form fields)
- **Alerts:** `#ff6b6b` (Red for errors), `#51cf66` (Green for success)

### Typography
- **Font:** Inter (with system fallbacks: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif)
- **Sizes:** Responsive with `clamp()` for fluid scaling
- **Weight:** 400 (normal), 500 (medium), 600 (buttons), 700 (headings)

---

## Contact & Feedback

For questions or feedback:
- **GitHub:** https://github.com/Dantwalig
- **Email:** d.gakumban@alustudent.com

---

## Academic Integrity

All UI and logic developed independently. External references cited:
- MDN Web Docs (semantic HTML, ARIA patterns)
- W3C WAI-ARIA Authoring Practices Guide
- Regular-Expressions.info (regex patterns)
- axe DevTools & WAVE (accessibility testing)

No AI-generated code; documentation and seed data generation with AI assistance as permitted.

---

## Version History

- **v1.0.0** (2025-10-17): Initial release with stats dashboard, settings, cap/target, comprehensive testing

---