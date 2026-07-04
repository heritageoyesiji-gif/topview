"use client";

import { useState, useEffect, useCallback } from "react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [selectedPill, setSelectedPill] = useState<string | null>(null);
  const [formSent, setFormSent]         = useState(false);
  const [formName, setFormName]         = useState("");
  const [formEmail, setFormEmail]       = useState("");
  const [formMessage, setFormMessage]   = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setFormSent(false);
        setSelectedPill(null);
        setFormName("");
        setFormEmail("");
        setFormMessage("");
      }, 400);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  }

  return (
    <div
      className={`contact-modal${isOpen ? " open" : ""}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="contact-panel">
        <div className="contact-left">
          <div>
            <p className="contact-agency-tag">TopView Agency</p>
            <h2 className="contact-heading">Let&apos;s<br />Talk.</h2>
            <p className="contact-desc">Tell us what you&apos;re building. We&apos;ll handle the rest — from strategy to execution.</p>
          </div>
          <div className="contact-meta">
            <a href="mailto:hello@topview.agency" className="contact-email">hello@topview.agency</a>
            <span className="contact-locations">Lagos · London</span>
          </div>
        </div>

        <div className="contact-right">
          <button className="contact-close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {formSent ? (
            <div className="contact-success visible">
              <div className="contact-success-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10l4.5 4.5L16 6" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="contact-sent-title">Sent.</p>
              <p className="contact-sent-sub">We&apos;ll be in touch shortly.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-row">
                <div className="contact-field">
                  <label className="contact-label">Name</label>
                  <input className="contact-input" type="text" placeholder="Your name" value={formName} onChange={e => setFormName(e.target.value)} required />
                </div>
                <div className="contact-field">
                  <label className="contact-label">Email</label>
                  <input className="contact-input" type="email" placeholder="your@email.com" value={formEmail} onChange={e => setFormEmail(e.target.value)} required />
                </div>
              </div>

              <div className="contact-field">
                <label className="contact-label">I&apos;m reaching out about</label>
                <div className="contact-pills">
                  {["Talent", "Campaigns", "Web / Software", "Other"].map(pill => (
                    <button
                      key={pill}
                      type="button"
                      className={`contact-pill${selectedPill === pill ? " active" : ""}`}
                      onClick={() => setSelectedPill(selectedPill === pill ? null : pill)}
                    >
                      {pill}
                    </button>
                  ))}
                </div>
              </div>

              <div className="contact-field">
                <label className="contact-label">Message</label>
                <textarea className="contact-input contact-textarea" rows={4} placeholder="Tell us about your project, timeline, or anything else..." value={formMessage} onChange={e => setFormMessage(e.target.value)} required />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "4px" }}>
                <button type="submit" className="contact-submit">
                  Send Message
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7"/><path d="M7 7h10v10"/>
                  </svg>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
