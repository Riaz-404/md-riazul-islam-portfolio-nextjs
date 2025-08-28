# Md. Riazul Islam - Portfolio Website

A modern, responsive portfolio website built with Next.js 15, featuring a dark/light theme toggle and smooth animations.

## 🚀 Features

- **Modern Tech Stack**: Built with Next.js 15, TypeScript, and Tailwind CSS
- **Theme Toggle**: Seamless dark/light mode switching
- **Responsive Design**: Optimized for all screen sizes
- **Smooth Animations**: Enhanced user experience with motion/react
- **SEO Optimized**: Meta tags and structured data for better search visibility
- **Component-based Architecture**: Modular and maintainable code structure
- **Server-Side Rendering**: Fast loading and better performance

## 🛠 Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Animations**: motion/react (not framer-motion)
- **Theme**: next-themes
- **Icons**: Lucide React
- **Fonts**: Work Sans, Roboto, Poppins

## 🎨 Design

The design maintains the same aesthetic as the original HTML/CSS/JS portfolio with:

- Dark theme as default (matching original #0b090a background)
- Primary accent color: #e1a34c (golden/orange)
- Clean, professional layout
- Animated text rotation for roles
- Technology icons showcase
- Social media integration

## 📱 Sections

### Navigation

- Fixed navigation with scroll effect
- Mobile-responsive hamburger menu
- Social media links
- Theme toggle button
- Smooth scroll to sections

### Hero Section

- Profile image with hover effects
- Animated role text rotation
- Technology icons with tooltips
- Download CV button
- Responsive two-column layout

## 🔧 Installation & Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd md-riazul-islam-portfolio-nextjs
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Run the development server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:5000](http://localhost:5000) in your browser

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/          # shadcn/ui components
│   ├── client-only.tsx
│   ├── hero-section.tsx
│   ├── navigation.tsx
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
└── lib/
    └── utils.ts
```

## 🎯 Performance Features

- **Server-Side Rendering**: Pages are pre-rendered for faster loading
- **Image Optimization**: Next.js Image component for optimized loading
- **Code Splitting**: Automatic code splitting for better performance
- **Font Optimization**: Google Fonts optimization with Next.js
- **CSS Optimization**: Tailwind CSS purging for smaller bundle sizes

## 🌐 SEO Features

- Meta tags for better search engine visibility
- Open Graph tags for social media sharing
- Twitter Card support
- Semantic HTML structure
- Alt tags for images
- Proper heading hierarchy

## 📄 License

This project is private and belongs to Md. Riazul Islam.

## 🤝 Contributing

This is a personal portfolio project. For any suggestions or feedback, please reach out through the contact section.

---

**Note**: This is a modern Next.js conversion of the original HTML/CSS/JS portfolio, maintaining the same design and content while adding new features like theme switching and enhanced animations.
