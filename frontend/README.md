# KalaKosha - Indian Folk Art Platform

A beautiful, responsive landing page for KalaKosha, a platform dedicated to preserving and promoting Indian folk art and culture. Built with React.js, Vite, and Vanilla CSS.

## 🎨 Features

- **Responsive Design**: Mobile-first approach with elegant desktop layouts
- **Heritage-Inspired Theme**: Earthy colors and traditional typography
- **Smooth Animations**: CSS transitions and hover effects
- **Modular Components**: Each section has its own CSS file for maintainability
- **Google Fonts**: Merriweather for headings, Open Sans for body text

## 🚀 Tech Stack

- **Frontend**: React.js 18
- **Build Tool**: Vite
- **Styling**: Vanilla CSS with CSS Variables
- **Icons**: React Icons
- **Fonts**: Google Fonts (Merriweather, Open Sans)

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Navigation bar with gradient background
│   ├── Navbar.css
│   ├── Hero.jsx            # Hero section with background image
│   ├── Hero.css
│   ├── Explore.jsx         # Feature cards section
│   ├── Explore.css
│   ├── Testimonials.jsx    # Customer testimonials carousel
│   ├── Testimonials.css
│   ├── Team.jsx            # Team member profiles
│   ├── Team.css
│   ├── Contact.jsx         # Contact information and form
│   ├── Contact.css
│   ├── Footer.jsx          # Footer with links and newsletter
│   └── Footer.css
├── App.jsx                 # Main app component
├── App.css                 # App-level styles
├── main.jsx                # Application entry point
└── index.css               # Global styles and CSS variables
```

## 🎯 Sections Implemented

1. **Navbar + Hero Section**
   - Gradient navbar with logo, menu items, and auth buttons
   - Full-width hero with background image and call-to-action buttons

2. **Explore Section**
   - Three feature cards with hover effects
   - Responsive grid layout

3. **Testimonials Section**
   - Carousel with navigation arrows
   - Avatar, name, role, and quote display

4. **Team Section**
   - Four team member profiles
   - Circular avatars with names and roles

5. **Contact Section**
   - Two-column layout with contact details and heritage image
   - Contact form with action buttons

6. **Footer**
   - Four-column layout with links and resources
   - Newsletter subscription form
   - Social media icons

## 🎨 Design Features

- **Color Palette**: Earthy browns, golds, and parchment colors
- **Typography**: Serif headings (Merriweather) for heritage feel
- **Layouts**: Flexbox and CSS Grid for modern layouts
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first design with breakpoints

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kalakosha
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📱 Responsive Breakpoints

- **Mobile**: 0px - 480px
- **Tablet**: 481px - 768px
- **Desktop**: 769px+

## 🎨 CSS Variables

The project uses CSS custom properties for consistent theming:

```css
:root {
  --primary-color: #8b4513;
  --accent-color: #b68d40;
  --background-color: #faf6f1;
  --footer-bg: #ece6da;
  --font-heading: 'Merriweather', serif;
  --font-body: 'Open Sans', sans-serif;
}
```

## 🔧 Customization

### Colors
Modify the CSS variables in `src/index.css` to change the color scheme.

### Fonts
Update the Google Fonts import in `index.html` and CSS variables to use different fonts.

### Images
Replace the placeholder SVG images with actual images by updating the `src` attributes in the components.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support or questions, please contact the development team or create an issue in the repository.

---

**KalaKosha** - Celebrating the Vibrancy of Indian Folk Art 🎭✨
