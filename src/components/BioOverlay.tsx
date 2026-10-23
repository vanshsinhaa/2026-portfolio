import { LinkPills } from "@/components/LinkPills";

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
              <LinkPills />
            </div>

            <div className="bio__content bio__intro" data-scope-main="">
              <img className="bio__portrait" src="/images/DSC03457.JPG" alt="Vansh Sinha" loading="lazy" data-scope-main="" />
              <p data-scope-main="">I&apos;m a software engineer working on backend systems, data infrastructure, and full-stack products.</p>
              <p data-scope-main="">I&apos;m studying Computer Science at Arizona State University with a minor in Data Science, graduating in May 2027. Right now I&apos;m on a senior capstone team with Banner Health, building an EKG imaging app for cardiac arrest risk scoring.</p>
            </div>

            <hr className="biocv__rule" data-scope-main="" />
            <div className="bio__label" data-scope-main=""><h3 data-scope-main="">Experience</h3></div>
            <div className="bio__content bio__exp" data-scope-main="">
              <div className="bio__job" data-scope-main="">
                <div className="bio__job-head">
                  <img className="bio__company-logo bio__company-logo--banner" src="/logos/banner-health.svg" alt="Banner Health" />
                  <div>
                    <p className="bio__job-role" data-scope-main="">Software Developer <span className="bio__dim" data-scope-main="">· Cardiac Electrophysiology, ASU Senior Capstone</span>
</p>
                    <p className="bio__job-dates" data-scope-main="">Banner University Medical Center Phoenix · Phoenix, AZ · Aug 2026 – Present</p>
                  </div>
                </div>
                <p className="bio__job-desc" data-scope-main="">Building an EKG imaging app for cardiac arrest risk scoring with a four-engineer team, for Banner Health&apos;s Cardiac Electrophysiology group.</p>
                <p className="bio__job-desc" data-scope-main="">Building an ECG digitization pipeline that turns paper and on-screen EKG images into digital waveforms and extracts T-wave attributes for risk scoring.</p>
                <p className="bio__job-desc" data-scope-main="">Developing EKG image de-identification for retrospective patient-data analysis, plus a fallback capture screen with image cropping.</p>
              </div>
              <div className="bio__job" data-scope-main="">
                <div className="bio__job-head">
                  <img className="bio__company-logo bio__company-logo--amex" src="/logos/AXP_BlueBoxLogo_Alternate_REGULARscale_RGB_DIGITAL_700x700.png" alt="American Express" />
                  <div>
                    <p className="bio__job-role" data-scope-main="">Software Engineer Intern <span className="bio__dim" data-scope-main="">· Global Loyalty Benefits</span>
</p>
                    <p className="bio__job-dates" data-scope-main="">American Express · Phoenix, AZ · Jun 2026 – Aug 2026</p>
                  </div>
                </div>
                <p className="bio__job-desc" data-scope-main="">Designed and shipped a four-state deployment lifecycle used by 100+ engineers, replacing destructive release deletes with auditable remove, revert, rollback, and active transitions.</p>
                <p className="bio__job-desc" data-scope-main="">Built one-action release reactivation, replacing a multi-day redeploy and approval cycle.</p>
                <p className="bio__job-desc" data-scope-main="">Delivered an event automation framework and rules UI end to end, sending 250+ Slack alerts a week, on a scheduler with retries, idempotency, and backoff.</p>
                <p className="bio__job-desc" data-scope-main="">Presented the work to senior leadership and received a return offer.</p>
              </div>
              <div className="bio__job" data-scope-main="">
                <div className="bio__job-head">
                  <img className="bio__company-logo bio__company-logo--wimoku" src="/logos/cropped-wimokuulogo.png" alt="Wimoku" />
                  <div>
                    <p className="bio__job-role" data-scope-main="">Software Engineer Intern <span className="bio__dim" data-scope-main="">· Data Infrastructure</span>
</p>
                    <p className="bio__job-dates" data-scope-main="">Wimoku · Remote · Jun 2025 – Aug 2025</p>
                  </div>
                </div>
                <p className="bio__job-desc" data-scope-main="">Built a real-time financial data pipeline with Pub/Sub and Apache Beam, streaming market data into BigQuery for analytics.</p>
                <p className="bio__job-desc" data-scope-main="">Replaced managed Dataflow with Pub/Sub and Cloud Functions, cutting pipeline cost 60% at the same throughput.</p>
                <p className="bio__job-desc" data-scope-main="">Shipped a Dockerized Kubernetes CronJob service that runs 200+ audited BigQuery queries daily.</p>
              </div>
            </div>
            <hr className="biocv__rule" data-scope-main="" />
            <div className="bio__label" data-scope-main=""><h3 data-scope-main="">Expertise</h3></div>
            <div className="bio__content bio__cols" data-scope-main="">
              <div><p className="bio__subhead" data-scope-main="">Focus areas</p><ul className="bio__list" data-scope-main=""><li>Backend systems</li><li>Data infrastructure</li><li>Full-stack web apps</li><li>Developer experience</li></ul></div>
              <div><p className="bio__subhead" data-scope-main="">Tools</p><ul className="bio__list" data-scope-main=""><li>Go, Python, TypeScript, Java, Swift, SQL</li><li>React, Next.js, FastAPI, Node.js</li><li>PostgreSQL, BigQuery, Redis, ChromaDB</li><li>Docker, Kubernetes, GCP, Apache Beam</li></ul></div>
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
