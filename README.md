# RezaCypher – Personal Portfolio

A modern, interactive portfolio website with a custom animated cursor, dark/light theming, dynamic hex background, CV with skill honeycombs, projects showcase, blog system, and social media links.

## 🚀 Features

- **Dynamic hexagon background** – animated glowing hexagons on every page
- **Theme switcher** – dark mode (red accents) and light mode (gold accents)
- **Custom cursor** – spinning hexagon with particle trail, a playful bee follower that steals the dot when idle, and hover burst effects
- **CV page** – interactive skill hexagons with progress rings, photo placeholder, expandable sections
- **Projects page** – card grid with expandable timeline details
- **Blog system** – searchable, paginated blog list (data‑driven) and individual blog post templates with rich components (alerts, code blocks, tables, etc.)
- **Social media page** – featured YouTube section with playlists, links to all platforms
- **Admin tools** – visual editor for blog posts, data editor for blogs and projects
- **Smooth page transitions** – fade‑in/fade‑out between pages
- **Responsive design** – works on desktop and mobile

## 🛠 Technologies

- **HTML5** – semantic, accessible structure
- **CSS3** – custom properties, backdrop‑filter, animations, grid & flexbox
- **Vanilla JavaScript** – no frameworks, just pure JS with Canvas API for background and custom cursor
- **SVG** – used for skill hexagons and progress rings

## ⚙ Setup

1. Clone or download the repository.
2. Place all files in a single folder.
3. Ensure the `img/` folder contains the required images (see [Customization](#-customization)).
4. Open `index.html` in a browser – no server needed.

## 🎨 Customization

### Replace placeholder content
- **CV** – edit `cv.html` and `script.cv.js` (skills data, about text, work experience, education)
- **Projects** – use `projects-editor.html` or edit `projects.html` directly
- **Blogs** – edit `script.blogs_data.js` or use `blogs-editor.html`
- **Social links** – update URLs in `socialmedia.html`

### Images
The following images are used (place them in the `img/` folder):
- `cypher_logo.png` / `cypher_logo_black.png` – homepage center logo (light / dark)
- `cypherlogo_s.png` / `cypherlogo_s_black.png` – header logo (light / dark)
- `mypic.png` / `mypic2.png` – CV photo (dark / light)
- `redbee.png` / `yellowbee.png` – custom cursor bee (dark / light)
- Blog images – `img/blogs/` folder
- Project icons – `img/projects/` folder

## 📄 License

This project is licensed under the **MIT License** – you are free to use, modify, and distribute it, but you **must give appropriate credit** to the original author.

**© 2024 MohammadReza MajidPour (RezaCypher)**

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## 🙏 Credits

- **Author:** MohammadReza MajidPour (RezaCypher)
- **Contact:** rezacypher@gmail.com
- **GitHub:** [@rezacypher](https://github.com/rezacypher)
