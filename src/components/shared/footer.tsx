import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="row align-items-center text-center text-lg-left">
          <div className="col-lg-4">
            <ul className="list-inline footer-socials">
              <li className="list-inline-item">
                <a
                  href="https://www.facebook.com/imriaz.cu/"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a
                  href="https://twitter.com/?lang=en"
                  aria-label="Twitter"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-twitter"></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a
                  href="https://www.instagram.com/i_m_riaz_/"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-instagram"></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a
                  href="https://www.linkedin.com/in/md-riazul-islam-891b65194/"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-linkedin"></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a
                  href="https://github.com/Riaz-404"
                  aria-label="Github"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-github"></i>
                </a>
              </li>
            </ul>
          </div>
          <div className="col-lg-4">
            <div>
              <p>
                Designed by{" "}
                <Link href="#top" className="smoth-scroll">
                  <span>Md. Riazul Islam</span>
                </Link>
              </p>
            </div>
          </div>
          <div className="col-lg-4">
            <p>&copy; {currentYear} All Rights Reserved.</p>
            <Link href="#top" className="backtop smoth-scroll" aria-label="Top">
              <i className="ti-angle-up"></i>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
