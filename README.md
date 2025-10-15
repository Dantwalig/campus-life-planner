# Campus Life Planner

**Live Demo:** [https://Dantwalig.github.io/campus-life-planner](https://Dantwalig.github.io/campus-life-planner)

**Demo Video:** [YouTube Link](https://youtu.be/your-video-id)

**Figma Design:** [View Design Mockups](https://www.figma.com/design/3rr9UMgkjUeAS2JQXtoF8C/Untitled?node-id=0-1&t=QBE1nG5NG0jLGDPU-1)

A responsive, accessible web application for managing campus tasks and events. Built with vanilla HTML, CSS, and JavaScript.

---

## 📋 Features

- ✅ Create, edit, and delete tasks/events
- ✅ Duration tracking (HH:MM format)
- ✅ Tag-based organization (comma-separated)
- ✅ Real-time regex search with match highlighting
- ✅ Sort by date, title, or duration
- ✅ JSON import/export with validation
- ✅ localStorage persistence across sessions
- ✅ Full keyboard navigation with shortcuts
- ✅ ARIA live regions and semantic HTML
- ✅ Mobile-first responsive design (3 breakpoints)

---

## 🚀 Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Dantwalig/campus-life-planner.git
   cd campus-life-planner
   ```

2. **Open in browser:**
   ```bash
   # Option 1: Direct open
   open index.html
   
   # Option 2: Local server
   python -m http.server 8000
   # Then visit: http://localhost:8000
   ```

3. **No build process required** — 100% vanilla JavaScript!

---

## 🔍 Regex Catalog

### 1. **Title Validation** (Advanced with Positive Lookahead)
- **Pattern:** `/^(?=.{2,})(?!\s+$).+/`
- **Purpose:** Ensures title is at least 2 characters (blank space does not count)
- **Techniques:** Positive lookahead `(?=.{2,})`, negative lookahead `(?!\s+$)`
- **Examples:**
  - ✅ Valid: `"CS Assignment"`, `"Project Meeting"`, `"Dr"`
  - ❌ Invalid: `"a"`, `"  "`, `""`

### 2. **Duration Validation**
- **Pattern:** `/^([0-9]{1,2}):([0-5][0-9])$/`
- **Purpose:** Validates HH:MM time format (0-99 hours, 00-59 minutes)
- **Captures:** Hours (1-2 digits), Minutes (00-59)
- **Examples:**
  - ✅ Valid: `"01:30"`, `"2:45"`, `"12:00"`, `"48:00"`
  - ❌ Invalid: `"1:60"`, `"ab:cd"`, `"1:5"`, `"100:00"`

### 3. **Date/Time Validation**
- **Pattern:** `/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/`
- **Purpose:** Validates ISO datetime-local format (YYYY-MM-DDTHH:MM)
- **Examples:**
  - ✅ Valid: `"2025-10-17T14:30"`, `"2025-01-01T00:00"`
  - ❌ Invalid: `"2025/10/17"`, `"Oct 17 2025"`, `"2025-10-17"`

### 4. **Tag Validation** (Unicode with Emoji Support)
- **Pattern:** `/^[\p{L}\p{N}\p{Emoji}_-]{1,30}$/u`
- **Purpose:** Validates individual tags (letters, numbers, emoji, underscore, dash; 1-30 chars)
- **Unicode:** `\p{L}` (letters), `\p{N}` (numbers), `\p{Emoji}` (emojis)
- **Examples:**
  - ✅ Valid: `"urgent"`, `"CS101"`, `"🎓"`, `"Office_Hour"`, `"mid-term"`
  - ❌ Invalid: `"tag with spaces"`, `"very-long-tag-name-exceeding-thirty-characters"`, `"tag@#$"`

### 5. **Search Regex Compiler Safety Check**
- **Pattern:** `/(\.\*){3,}|(\(\?:.*\|\.*\))/u`
- **Purpose:** Prevents catastrophic backtracking in user search queries
- **Behavior:** Returns `null` for unsafe patterns like `.*.*.*` or `(?:.*|.*)`

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `n` | Create new task/event |
| `Ctrl/Cmd + S` | Save current form |
| `Enter` (on list item) | Edit selected item |
| `Delete` or `d` (on item) | Delete selected item |
| `Tab` | Navigate through form fields |
| `Shift + Tab` | Navigate backwards |
| `Esc` | Clear form/cancel edit |

---

## ♿ Accessibility Features

### Semantic HTML
- **Landmark regions:** `<header>`, `<nav>`, `<main>`, `<footer>`, `<aside>`
- **Heading hierarchy:** H1 (app title) → H2 (section titles)
- **Form labels:** All inputs have associated `<label>` elements via `for`/`id`

### ARIA Implementation
- **Roles:** `role="banner"`, `role="navigation"`, `role="main"`, `role="contentinfo"`, `role="status"`, `role="alert"`
- **Labels:** `aria-label` on all interactive controls (buttons, inputs, select)
- **Live regions:** `aria-live="polite"` for dynamic announcements, `aria-atomic="true"` for complete messages
- **Descriptions:** `aria-describedby` for form instructions
- **Dialogs:** `aria-haspopup="dialog"` on "+ New" button

### Keyboard Navigation
- **Skip link:** Jump to main content (bypasses header/nav)
- **Focus management:** Form fields receive focus on edit, items are focusable with `tabindex="0"`
- **Focus indicators:** Visible outlines on all interactive elements
- **No keyboard traps:** All modals/forms can be exited

### Screen Reader Support
- **Live announcements:** Form submissions, deletions, search results announced
- **Alternative text:** Logo has descriptive `alt` text
- **Semantic markup:** Lists use `<ul>`/`<li>`, forms use proper structure

### Visual Accessibility
- **Color contrast:** All text meets WCAG AA standards (4.5:1 for normal text)
- **Focus indicators:** 2px solid outline with offset
- **Reduced motion:** Respects `prefers-reduced-motion` for animations
- **Scalable text:** Uses `rem`/`em` units, supports browser zoom up to 200%

---

## 📁 Project Structure

```
campus-life-planner/
├── index.html              # Main HTML file
├── styles/
│   ├── base.css           # Global styles, typography, forms
│   ├── layout.css         # Grid, responsive breakpoints
│   └── animations.css     # Transitions and animations
├── scripts/
│   ├── main.js            # Entry point, event handlers
│   ├── storage.js         # localStorage operations
│   ├── state.js           # App state management
│   ├── ui.js              # DOM manipulation
│   ├── validation.js      # Regex validations
│   └── search.js          # Search and filtering
├── assets/
│   └── Campus life planner Logo.png
├── seed.json              # Sample data (10+ records)
├── .gitignore
└── README.md
```

---

## 🧪 Testing Instructions

### Manual Testing Checklist

1. **Form Validation:**
   - Try submitting with empty title → Should show error
   - Enter invalid duration (e.g., `"1:60"`) → Should show error
   - Enter duplicate tags (e.g., `"urgent, urgent"`) → Should show error

2. **CRUD Operations:**
   - Create new task → Should appear in list
   - Edit existing task → Changes should persist
   - Delete task → Should be removed from list

3. **Search:**
   - Search for partial text → Should filter and highlight matches
   - Test regex patterns: `^CS`, `\d+`, `[aeiou]`
   - Try invalid regex → Should handle gracefully

4. **Import/Export:**
   - Export JSON → Should download file
   - Import valid JSON → Should merge with existing data
   - Import invalid JSON → Should show error

5. **Keyboard Navigation:**
   - Press `n` → Form should gain focus
   - Tab through form → All fields reachable
   - Press `Enter` on item → Should edit
   - Press `d` on item → Should delete (with confirmation)

6. **Responsive Design:**
   - Test on mobile (< 768px) → Single column layout
   - Test on tablet (768-1023px) → Two-column layout
   - Test on desktop (≥ 1024px) → Three-column layout

7. **Persistence:**
   - Add items and refresh page → Data should persist
   - Clear localStorage and refresh → Should load seed.json

### Browser Testing

- **Chrome/Edge:** Full support
- **Firefox:** Full support
- **Safari:** Full support (iOS 12+)
- **Screen Readers:** Tested with NVDA (Windows), VoiceOver (macOS/iOS)

### Accessibility Testing Tools

- **axe DevTools:** No critical violations
- **WAVE:** No errors
- **Lighthouse:** 100 Accessibility score
- **Keyboard only:** All features accessible without mouse

---

## 💾 Data Format

### Item Structure
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

### seed.json
The `seed.json` file contains 10 diverse records demonstrating:
- Various date ranges (past, present, future)
- Different duration formats (00:15 to 48:00)
- Multiple tag combinations
- Special characters and emoji in tags
- Edge cases (very long descriptions, special events)

---

## 🎨 Design Decisions

### Color Palette
- **Background:** `#2b2d42` (Dark navy)
- **Accent:** `#f9e71e` (Yellow for CTAs)
- **Text:** `#ffffff` (White for readability)
- **Borders:** `#3a3d52` (Subtle separation)
- **Input Background:** `#e8e8e8` (Light gray)
- **Input Text:** `#333` (Dark gray)

### Typography
- **Font:** Inter (with system fallbacks)
- **Sizes:** Responsive with `clamp()` for fluid scaling
- **Weight:** 600 for buttons, 700 for headings

### Spacing System
- Mobile: 1rem base padding
- Tablet: 1.5-2rem padding
- Desktop: 2-2.5rem padding

---

## 🔒 Security & Validation

- **Input sanitization:** All user input is escaped before rendering
- **XSS prevention:** Uses `textContent` and `escapeHtml()` for dynamic content
- **Regex safety:** Prevents catastrophic backtracking patterns
- **localStorage limits:** Graceful handling of quota exceeded errors
- **JSON validation:** Strict type checking on import

---

## 🌐 Browser Compatibility

- **Modern browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **ES6 modules:** Required (no transpilation)
- **localStorage:** Required
- **CSS Grid:** Required
- **Regex Unicode:** `\p{}` requires modern browser

---

## 📝 Known Limitations

1. **No backend:** Data only stored in localStorage (browser-specific)
2. **Single device:** No sync across devices
3. **Storage limit:** ~5-10MB localStorage limit per domain
4. **No authentication:** All data is client-side

---

## 🚀 Future Enhancements (Stretch Goals)

- [ ] Service worker for offline support
- [ ] Dark/light theme toggle with persistence
- [ ] CSV export functionality
- [ ] Recurring events
- [ ] Calendar view
- [ ] Categories/filters
- [ ] Drag-and-drop reordering

---

## 📦 Dependencies

**None!** This project uses 100% vanilla JavaScript, HTML, and CSS.

---

## 🙏 Acknowledgments

- **Semantic HTML:** MDN Web Docs
- **ARIA patterns:** W3C WAI-ARIA Authoring Practices
- **Regex inspiration:** Regular-Expressions.info
- **Accessibility testing:** axe DevTools, WAVE

---

## 📧 Contact

For questions or feedback about this project:
- **GitHub:** [Dantwalig](https://github.com/Dantwalig)
- **Email:** d.gakumban@alustudent.com

---
