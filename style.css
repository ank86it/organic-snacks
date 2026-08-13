/* ==================================================
   ORGANIC SNACKS STORE
   Main Website Styles
================================================== */


/* ==================================================
   1. DESIGN VARIABLES
================================================== */

:root {
  --green-dark: #174d35;
  --green: #28764f;
  --green-medium: #4f956d;
  --green-light: #eaf6ee;

  --cream: #fffaf0;
  --cream-dark: #f4ead8;

  --brown: #654321;
  --gold: #c68a27;
  --gold-light: #fff4d6;

  --text: #26332b;
  --muted: #68756d;

  --white: #ffffff;
  --black: #17221b;

  --red: #a83e32;
  --red-light: #fff0ee;

  --border: #dce7df;
  --shadow: 0 10px 30px rgba(25, 70, 45, 0.09);

  --radius-small: 8px;
  --radius-medium: 14px;
  --radius-large: 22px;
}


/* ==================================================
   2. RESET AND BASIC STYLES
================================================== */

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  color: var(--text);
  background: var(--cream);
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.65;
}

img {
  display: block;
  max-width: 100%;
}

a {
  color: var(--green);
  text-decoration: none;
}

a:hover {
  color: var(--green-dark);
  text-decoration: underline;
}

button,
input,
select {
  font: inherit;
}

button {
  cursor: pointer;
}


/* ==================================================
   3. HEADER AND NAVIGATION
================================================== */

.site-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--white);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 3px 15px rgba(25, 70, 45, 0.06);
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;

  max-width: 1250px;
  min-height: 76px;
  margin: 0 auto;
  padding: 12px 22px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 9px;

  color: var(--green-dark);
  font-size: 1.25rem;
  font-weight: 800;
  white-space: nowrap;
}

.brand:hover {
  color: var(--green);
  text-decoration: none;
}

.brand-icon {
  font-size: 1.8rem;
}

.nav-links {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
}

.nav-links a {
  color: var(--text);
  font-size: 0.92rem;
  font-weight: 600;
}

.nav-links a:hover {
  color: var(--green);
  text-decoration: none;
}

.menu-button {
  display: none;
  padding: 7px 12px;
  color: var(--green-dark);
  background: var(--green-light);
  border: 1px solid var(--border);
  border-radius: var(--radius-small);
  font-size: 1.4rem;
}


/* ==================================================
   4. HERO SECTION
================================================== */

.hero-section {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(300px, 0.9fr);
  align-items: center;
  gap: 50px;

  max-width: 1250px;
  min-height: 570px;
  margin: 0 auto;
  padding: 75px 22px;

  background:
    radial-gradient(
      circle at 90% 10%,
      rgba(198, 138, 39, 0.13),
      transparent 30%
    );
}

.hero-content {
  max-width: 650px;
}

.eyebrow {
  margin: 0 0 12px;
  color: var(--gold);
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.hero-section h1 {
  margin: 0 0 22px;
  color: var(--green-dark);
  font-size: clamp(2.7rem, 6vw, 5.3rem);
  line-height: 1.04;
}

.hero-text {
  max-width: 600px;
  margin: 0 0 28px;
  color: var(--muted);
  font-size: 1.12rem;
}

.hero-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.primary-button,
.secondary-button {
  display: inline-block;
  padding: 12px 20px;
  border-radius: 30px;
  font-weight: 700;
  text-decoration: none;
  transition: 0.2s ease;
}

.primary-button {
  color: var(--white);
  background: var(--green);
  box-shadow: 0 5px 15px rgba(40, 118, 79, 0.2);
}

.primary-button:hover {
  color: var(--white);
  background: var(--green-dark);
  text-decoration: none;
  transform: translateY(-2px);
}

.secondary-button {
  color: var(--green-dark);
  background: var(--white);
  border: 1px solid var(--green);
}

.secondary-button:hover {
  color: var(--white);
  background: var(--green);
  text-decoration: none;
}

.hero-image-wrapper {
  position: relative;
}

.hero-image-wrapper::before {
  position: absolute;
  top: -18px;
  right: -18px;
  bottom: 18px;
  left: 18px;
  z-index: 0;

  content: "";
  border: 2px solid var(--gold);
  border-radius: var(--radius-large);
}

.hero-image {
  position: relative;
  z-index: 1;

  width: 100%;
  min-height: 390px;
  object-fit: cover;
  border-radius: var(--radius-large);
  box-shadow: var(--shadow);
}


/* ==================================================
   5. TRUST SECTION
================================================== */

.trust-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;

  max-width: 1250px;
  margin: 0 auto 25px;
  padding: 0 22px;
}

.trust-item {
  padding: 24px 18px;
  background: var(--white);
  text-align: center;
  border: 1px solid var(--border);
}

.trust-item:first-child {
  border-radius: var(--radius-medium) 0 0 var(--radius-medium);
}

.trust-item:last-child {
  border-radius: 0 var(--radius-medium) var(--radius-medium) 0;
}

.trust-icon {
  display: block;
  margin-bottom: 8px;
  font-size: 2rem;
}

.trust-item h3 {
  margin: 0 0 7px;
  color: var(--green-dark);
  font-size: 1rem;
}

.trust-item p {
  margin: 0;
  color: var(--muted);
  font-size: 0.88rem;
}


/* ==================================================
   6. GENERAL SECTIONS
================================================== */

.page-section {
  max-width: 1250px;
  margin: 0 auto;
  padding: 78px 22px;
}

.section-heading {
  max-width: 760px;
  margin: 0 auto 35px;
  text-align: center;
}

.section-heading h2,
.preparation-content h2,
.special-order-content h2 {
  margin: 0 0 15px;
  color: var(--green-dark);
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 1.15;
}

.section-heading p:not(.eyebrow) {
  margin: 0;
  color: var(--muted);
}


/* ==================================================
   7. PRODUCT TOOLBAR
================================================== */

.product-toolbar {
  display: grid;
  grid-template-columns: auto minmax(200px, 1fr) auto minmax(170px, 220px);
  align-items: center;
  gap: 12px;

  margin-bottom: 22px;
  padding: 18px;
  background: var(--green-light);
  border: 1px solid var(--border);
  border-radius: var(--radius-medium);
}

.search-label,
.filter-label {
  color: var(--green-dark);
  font-size: 0.9rem;
  font-weight: 700;
}

.search-input,
.category-filter {
  width: 100%;
  padding: 11px 13px;
  color: var(--text);
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-small);
  outline: none;
}

.search-input:focus,
.category-filter:focus {
  border-color: var(--green);
  box-shadow: 0 0 0 3px rgba(40, 118, 79, 0.12);
}

.product-message {
  min-height: 28px;
  margin: 18px 0;
  color: var(--muted);
  text-align: center;
  font-size: 0.95rem;
}


/* ==================================================
   8. PRODUCT GRID AND CARDS
================================================== */

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.product-card {
  overflow: hidden;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-medium);
  box-shadow: var(--shadow);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  box-shadow: 0 15px 35px rgba(25, 70, 45, 0.14);
  transform: translateY(-4px);
}

.product-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  background: var(--green-light);
}

.product-card-content {
  padding: 20px;
}

.product-category {
  display: inline-block;
  margin-bottom: 7px;
  color: var(--gold);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.product-card h3 {
  margin: 0 0 10px;
  color: var(--green-dark);
  font-size: 1.35rem;
  line-height: 1.2;
}

.product-description {
  min-height: 48px;
  margin: 0 0 15px;
  color: var(--muted);
  font-size: 0.92rem;
}

.product-information {
  padding: 13px;
  background: #f8fcf9;
  border: 1px solid var(--border);
  border-radius: var(--radius-small);
}

.product-information p {
  margin: 7px 0;
  color: var(--muted);
  font-size: 0.84rem;
}

.product-information strong {
  color: var(--green-dark);
}

.product-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;

  margin: 18px 0 12px;
  color: var(--muted);
}

.product-meta strong {
  color: var(--green-dark);
  font-size: 1.25rem;
}

.availability,
.special-order-label {
  display: inline-block;
  margin: 3px 4px 3px 0;
  padding: 6px 10px;
  border-radius: 30px;
  font-size: 0.78rem;
  font-weight: 700;
}

.availability-in {
  color: #17653a;
  background: #e5f6ea;
}

.availability-limited {
  color: #805b00;
  background: #fff1c8;
}

.availability-out {
  color: #8d2c25;
  background: #ffe2df;
}

.availability-special {
  color: #5f3a89;
  background: #eee4fb;
}

.special-order-label {
  color: #5f3a89;
  background: #eee4fb;
}

.details-button {
  display: block;
  width: 100%;
  margin-top: 15px;
  padding: 11px 15px;
  color: var(--white);
  background: var(--green);
  border: 0;
  border-radius: var(--radius-small);
  font-weight: 700;
  transition: background 0.2s ease;
}

.details-button:hover {
  background: var(--green-dark);
}


/* ==================================================
   9. ORGANIC INFORMATION SECTION
================================================== */

.information-section {
  background: var(--green-light);
  border-radius: var(--radius-large);
}

.information-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.information-card {
  padding: 25px 20px;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-medium);
}

.information-icon {
  display: block;
  margin-bottom: 12px;
  font-size: 2rem;
}

.information-card h3 {
  margin: 0 0 10px;
  color: var(--green-dark);
  font-size: 1.1rem;
}

.information-card p {
  margin: 0;
  color: var(--muted);
  font-size: 0.92rem;
}

.important-note {
  margin-top: 25px;
  padding: 16px 18px;
  color: #654b10;
  background: var(--gold-light);
  border-left: 5px solid var(--gold);
  border-radius: var(--radius-small);
  font-size: 0.92rem;
}


/* ==================================================
   10. PREPARATION SECTION
================================================== */

.preparation-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 50px;
}

.preparation-content {
  max-width: 580px;
}

.preparation-content > p:not(.eyebrow) {
  margin: 0 0 25px;
  color: var(--muted);
}

.preparation-list {
  padding: 10px 0;
}

.preparation-item {
  display: flex;
  align-items: center;
  gap: 18px;

  padding: 17px 0;
  border-bottom: 1px solid var(--border);
}

.preparation-item:first-child {
  border-top: 1px solid var(--border);
}

.preparation-item span {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  color: var(--white);
  background: var(--green);
  border-radius: 50%;
  font-weight: 800;
}

.preparation-item p {
  margin: 0;
  color: var(--muted);
}


/* ==================================================
   11. CONTENT PLACEHOLDER
================================================== */

.content-placeholder {
  max-width: 700px;
  margin: 0 auto;
  padding: 50px 25px;
  background: var(--white);
  border: 2px dashed var(--border);
  border-radius: var(--radius-medium);
  text-align: center;
}

.placeholder-icon {
  display: block;
  margin-bottom: 12px;
  color: var(--gold);
  font-size: 3rem;
}

.content-placeholder h3 {
  margin: 0 0 8px;
  color: var(--green-dark);
}

.content-placeholder p {
  margin: 0;
  color: var(--muted);
}


/* ==================================================
   12. ARTICLE SECTION
================================================== */

.article-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.article-card {
  position: relative;
  padding: 25px;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-medium);
  box-shadow: var(--shadow);
}

.article-number {
  display: block;
  margin-bottom: 15px;
  color: var(--gold);
  font-size: 1.8rem;
  font-weight: 800;
}

.article-card h3 {
  margin: 0 0 12px;
  color: var(--green-dark);
  font-size: 1.2rem;
}

.article-card p {
  min-height: 80px;
  margin: 0 0 15px;
  color: var(--muted);
  font-size: 0.92rem;
}

.article-card a {
  font-weight: 700;
}


/* ==================================================
   13. SPECIAL ORDER SECTION
================================================== */

.special-order-section {
  display: grid;
  grid-template-columns: 1fr 0.9fr;
  align-items: center;
  gap: 45px;

  color: var(--white);
  background: var(--green-dark);
  border-radius: var(--radius-large);
}

.special-order-section .eyebrow {
  color: #f0c96c;
}

.special-order-content h2 {
  color: var(--white);
}

.special-order-content p:not(.eyebrow) {
  margin: 0 0 25px;
  color: rgba(255, 255, 255, 0.82);
}

.special-order-content .primary-button {
  color: var(--green-dark);
  background: var(--white);
}

.special-order-content .primary-button:hover {
  color: var(--white);
  background: var(--green);
}

.special-order-box {
  padding: 20px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-medium);
}

.special-order-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;

  padding: 15px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
}

.special-order-row:last-child {
  border-bottom: 0;
}

.special-order-row strong {
  color: #f0c96c;
}

.special-order-row span {
  color: rgba(255, 255, 255, 0.85);
  text-align: right;
}


/* ==================================================
   14. CONTACT SECTION
================================================== */

.contact-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.contact-card {
  padding: 25px 18px;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-medium);
  text-align: center;
}

.contact-icon {
  display: block;
  margin-bottom: 10px;
  font-size: 2rem;
}

.contact-card h3 {
  margin: 0 0 8px;
  color: var(--green-dark);
}

.contact-card p {
  margin: 0;
  color: var(--muted);
  font-size: 0.92rem;
}

.contact-card a {
  font-weight: 700;
}


/* ==================================================
   15. FOOTER
================================================== */

.site-footer {
  padding: 55px 22px 20px;
  color: white;
  background: var(--green-dark);
}

.footer-content {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 45px;

  max-width: 1250px;
  margin: 0 auto;
}

.footer-brand h2 {
  margin: 0 0 10px;
  color: var(--white);
}

.footer-brand p {
  margin: 0;
  color: rgba(255, 255, 255, 0.75);
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.footer-links h3 {
  margin: 0 0 7px;
  color: #f0c96c;
  font-size: 1rem;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.9rem;
}

.footer-links a:hover {
  color: var(--white);
}

.footer-bottom {
  max-width: 1250px;
  margin: 45px auto 0;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.18);
  text-align: center;
}

.footer-bottom p {
  margin: 5px 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
}


/* ==================================================
   16. TABLET RESPONSIVE DESIGN
================================================== */

@media (max-width: 1050px) {
  .nav-links {
    gap: 13px;
  }

  .nav-links a {
    font-size: 0.84rem;
  }

  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .information-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .contact-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}


/* ==================================================
   17. MOBILE RESPONSIVE DESIGN
================================================== */

@media (max-width: 760px) {
  .site-header {
    position: relative;
  }

  .navbar {
    min-height: 68px;
    padding: 10px 18px;
  }

  .menu-button {
    display: block;
  }

  .nav-links {
    display: none;
    position: absolute;
    top: 68px;
    right: 0;
    left: 0;

    flex-direction: column;
    align-items: stretch;
    gap: 0;

    padding: 10px 18px 18px;
    background: var(--white);
    border-bottom: 1px solid var(--border);
    box-shadow: var(--shadow);
  }

  .nav-links.nav-open {
    display: flex;
  }

  .nav-links a {
    padding: 12px 5px;
    border-bottom: 1px solid var(--border);
    font-size: 0.95rem;
  }

  .nav-links a:last-child {
    border-bottom: 0;
  }

  .hero-section {
    grid-template-columns: 1fr;
    gap: 35px;
    min-height: auto;
    padding: 60px 20px;
  }

  .hero-section h1 {
    font-size: clamp(2.5rem, 12vw, 4rem);
  }

  .hero-text {
    font-size: 1rem;
  }

  .hero-image {
    min-height: 280px;
  }

  .trust-section {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    padding: 0 15px;
  }

  .trust-item {
    border-radius: var(--radius-medium);
  }

  .product-toolbar {
    grid-template-columns: 1fr;
    align-items: stretch;
  }

  .product-grid {
    grid-template-columns: 1fr;
  }

  .page-section {
    padding: 58px 18px;
  }

  .information-grid,
  .article-grid,
  .contact-grid {
    grid-template-columns: 1fr;
  }

  .preparation-section,
  .special-order-section {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 55px 22px;
  }

  .article-card p {
    min-height: auto;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}


/* ==================================================
   18. SMALL MOBILE DEVICES
================================================== */

@media (max-width: 430px) {
  .brand {
    font-size: 1.05rem;
  }

  .brand-icon {
    font-size: 1.5rem;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .primary-button,
  .secondary-button {
    text-align: center;
  }

  .trust-section {
    grid-template-columns: 1fr;
  }

  .trust-item:first-child,
  .trust-item:last-child {
    border-radius: var(--radius-medium);
  }

  .special-order-row {
    flex-direction: column;
    gap: 4px;
  }

  .special-order-row span {
    text-align: left;
  }
}
