export function BioOverlay() {
  return (
    <div className="bio-overlay" id="bio-overlay" aria-hidden="true" data-scope-main="">
      <div className="bio-overlay__backdrop" data-bio-close="" data-scope-main="" />
      <aside className="bio-panel" role="dialog" aria-modal="true" aria-label="About Vansh Sinha" data-scope-main="">
        <div className="modal__bar modal__bar--top" data-scope-main="">
          <span className="modal__num" data-scope-main="">About</span>
          <button className="pill-btn" data-bio-close="" aria-label="Close" data-scope-main="">
            <svg className="pill-x" viewBox="0 0 24 24" aria-hidden="true" data-scope-main="">
              <path d="M6 6 18 18M6 18 18 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="case__scroll" data-scope-main="">
          <div className="biocv" data-scope-main="">
            <div className="bio__label" data-scope-main="">
              <p className="bio__name" data-scope-main="">Vansh Sinha</p>
              <a href="mailto:vanshsinhaacademics@gmail.com" data-scope-main="">vanshsinhaacademics@gmail.com</a>
              <div className="bio__links" data-scope-main="">
                <a href="/resume/resume.pdf" target="_blank" rel="noopener" data-scope-main="">Resume</a>
                <a href="https://www.linkedin.com/in/vanshsinha/" target="_blank" rel="noopener" data-scope-main="">LinkedIn</a>
                <a href="https://github.com/vanshsinhaa" target="_blank" rel="noopener" data-scope-main="">GitHub</a>
              </div>
            </div>

            <div className="bio__content bio__intro" data-scope-main="">
              <img className="bio__portrait" src="/images/DSC03457.JPG" alt="Vansh Sinha" loading="lazy" data-scope-main="" />
              <p data-scope-main="">I&apos;m a software engineer and data infrastructure builder focused on reliable systems, thoughtful developer experiences, and full-stack products.</p>
              <p data-scope-main="">I&apos;m studying Computer Science at Arizona State University with a minor in Data Science, graduating in May 2027. I enjoy making complex workflows feel simple—from dependable release tooling to real-time data pipelines.</p>
            </div>

            <hr className="biocv__rule" data-scope-main="" />
            <div className="bio__label" data-scope-main=""><h3 data-scope-main="">Experience</h3></div>
            <div className="bio__content bio__exp" data-scope-main="">
              <div className="bio__job" data-scope-main="">
                <div className="bio__job-head">
                  <img className="bio__company-logo bio__company-logo--amex" src="/logos/AXP_BlueBoxLogo_Alternate_REGULARscale_RGB_DIGITAL_700x700.png" alt="American Express" />
                  <div>
                    <p className="bio__job-role" data-scope-main="">Software Engineer Intern <span className="bio__dim" data-scope-main="">· Global Loyalty Benefits</span></p>
                    <p className="bio__job-dates" data-scope-main="">American Express · Phoenix, AZ · Jun 2026 – Aug 2026</p>
                  </div>
                </div>
                <p className="bio__job-desc" data-scope-main="">Shipped remove, revert, and rollback controls for Loyalty&apos;s internal release platform in Go, React, and PostgreSQL—replacing manual production-fix workflows.</p>
                <p className="bio__job-desc" data-scope-main="">Built Hawk&apos;s configurable actions, conditions, and scheduling engine for reliable automated Slack alerts, with retries, idempotency, and backoff.</p>
              </div>

              <div className="bio__job" data-scope-main="">
                <div className="bio__job-head">
                  <img className="bio__company-logo bio__company-logo--wimoku" src="/logos/cropped-wimokuulogo.png" alt="Wimoku" />
                  <div>
                    <p className="bio__job-role" data-scope-main="">Software Engineer Intern <span className="bio__dim" data-scope-main="">· Data Infrastructure</span></p>
                    <p className="bio__job-dates" data-scope-main="">Wimoku · Remote · Jun 2025 – Present</p>
                  </div>
                </div>
                <p className="bio__job-desc" data-scope-main="">Built real-time financial data pipelines with Google Pub/Sub, Apache Beam, and BigQuery for downstream analytics.</p>
                <p className="bio__job-desc" data-scope-main="">Reduced infrastructure cost by redesigning the streaming path around Pub/Sub and Cloud Functions, while preserving throughput and fault tolerance.</p>
                <p className="bio__job-desc" data-scope-main="">Shipped a Dockerized Kubernetes CronJob service for scheduled, audited BigQuery query execution.</p>
              </div>
            </div>

            <hr className="biocv__rule" data-scope-main="" />
            <div className="bio__label" data-scope-main=""><h3 data-scope-main="">Expertise</h3></div>
            <div className="bio__content bio__cols" data-scope-main="">
              <div><p className="bio__subhead" data-scope-main="">Focus areas</p><ul className="bio__list" data-scope-main=""><li>Backend systems</li><li>Data infrastructure</li><li>Full-stack web apps</li><li>Developer experience</li></ul></div>
              <div><p className="bio__subhead" data-scope-main="">Tools</p><ul className="bio__list" data-scope-main=""><li>Go, Python, TypeScript, SQL</li><li>React, Next.js, FastAPI</li><li>PostgreSQL, BigQuery, GCP</li><li>Docker, Kubernetes, Apache Beam</li></ul></div>
            </div>

            <hr className="biocv__rule" data-scope-main="" />
            <div className="bio__label" data-scope-main=""><h3 data-scope-main="">Education</h3></div>
            <div className="bio__content" data-scope-main="">
              <p className="bio__row" data-scope-main=""><span className="bio__subhead" data-scope-main="">Arizona State University</span> B.S. Computer Science, Minor in Data Science · GPA 3.8/4.0 <span className="bio__dim" data-scope-main=""><em>Aug 2023 – May 2027</em></span></p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
