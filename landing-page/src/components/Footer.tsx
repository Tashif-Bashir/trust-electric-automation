const currentYear = new Date().getFullYear();

const productLinks = [
  "NEOS 500W Radiator",
  "NEOS 1000W Radiator",
  "NEOS 1500W Radiator",
  "NEOS 2000W Radiator",
];

const companyLinks = [
  "About Us",
  "Installation",
  "Warranty",
  "Contact",
];

function SocialIcon({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-brand-amber hover:border-brand-amber transition-colors duration-200"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Column 1 — Brand */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="font-sans font-black text-[1.7rem] leading-none tracking-tight text-brand-amber">
                trust<sup className="text-[0.45em] align-super ml-px font-medium">®</sup>
              </p>
              <p className="font-sans text-[10px] text-white/50 leading-none mt-0.5">
                Electric Heating
              </p>
            </div>
            <p className="font-sans text-sm text-white/60 leading-relaxed max-w-xs">
              Makers of the NEOS radiator — patented natural stone core technology
              for smarter, greener home heating. Designed and manufactured in Leeds.
            </p>
            <div className="flex gap-2 mt-1">
              {/* Instagram */}
              <SocialIcon label="Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </SocialIcon>
              {/* Facebook */}
              <SocialIcon label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </SocialIcon>
              {/* LinkedIn */}
              <SocialIcon label="LinkedIn">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </SocialIcon>
            </div>
          </div>

          {/* Column 2 — Products */}
          <div>
            <h3 className="font-sans text-xs font-semibold tracking-[0.15em] uppercase text-white/40 mb-5">
              Products
            </h3>
            <ul className="flex flex-col gap-3">
              {productLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-sans text-sm text-white/70 hover:text-brand-amber transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Company */}
          <div>
            <h3 className="font-sans text-xs font-semibold tracking-[0.15em] uppercase text-white/40 mb-5">
              Company
            </h3>
            <ul className="flex flex-col gap-3">
              {companyLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-sans text-sm text-white/70 hover:text-brand-amber transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h3 className="font-sans text-xs font-semibold tracking-[0.15em] uppercase text-white/40 mb-5">
              Contact
            </h3>
            <address className="not-italic flex flex-col gap-3">
              <p className="font-sans text-sm text-white/70 leading-relaxed">
                Elmfield Business Park<br />
                Lotherton Way, Garforth<br />
                Leeds LS25 2JY
              </p>
              <a
                href="tel:+441132000000"
                className="font-sans text-sm text-white/70 hover:text-brand-amber transition-colors duration-200"
              >
                0113 200 0000
              </a>
              <a
                href="mailto:info@trustelectricheating.co.uk"
                className="font-sans text-sm text-white/70 hover:text-brand-amber transition-colors duration-200 break-all"
              >
                info@trustelectricheating.co.uk
              </a>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans text-white/40">
          <p>© {currentYear} Trust Electric Heating Ltd. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-brand-amber transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-amber transition-colors">Terms</a>
            <a href="#" className="hover:text-brand-amber transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
