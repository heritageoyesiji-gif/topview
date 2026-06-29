"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const inquiryTypes = ["Talent", "Campaigns", "Web / Software", "Other"];

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ContactDialog({ open, onOpenChange }: ContactDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    // RAF ensures Radix has committed the portal to the DOM and set the ref
    requestAnimationFrame(() => {
      if (!panelRef.current) return;
      gsap.set(panelRef.current, { y: 24, opacity: 0, scale: 0.96 });
      gsap.to(panelRef.current, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power3.out",
      });
    });
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      onOpenChange(false);
      setTimeout(() => {
        setSent(false);
        setName(""); setEmail(""); setType(""); setMessage("");
      }, 400);
    }, 1800);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Backdrop — fade handled by CSS */}
        <Dialog.Overlay className="dialog-overlay fixed inset-0 z-100 bg-black/80 backdrop-blur-md" />

        {/*
          Full-screen flex container = bulletproof centering, no transform math.
          Clicking the container outside the panel closes the dialog.
        */}
        <Dialog.Content
          aria-describedby="contact-description"
          onClick={(e) => {
            if (e.target === e.currentTarget) onOpenChange(false);
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 101,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            outline: "none",
          }}
        >
          {/* Panel — GSAP owns opacity/scale/y; React never writes opacity here */}
          <div
            ref={panelRef}
            className="w-full overflow-y-auto rounded-3xl bg-[#0c0c0c] border border-white/8
              flex flex-col md:flex-row"
            style={{ maxWidth: "64rem", maxHeight: "88vh" }}
          >
            {/* Left — brand */}
            <div className="md:w-[42%] shrink-0 flex flex-col justify-between p-8 md:p-12
              bg-white/3 border-b md:border-b-0 md:border-r border-white/8">
              <div>
                <p className="text-white/30 text-[10px] uppercase tracking-[0.35em] font-sans mb-8">
                  TopView Agency
                </p>
                <Dialog.Title
                  className="display font-black uppercase text-white leading-none"
                  style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)" }}
                >
                  Let&apos;s<br />Talk.
                </Dialog.Title>
                <Dialog.Description
                  id="contact-description"
                  className="mt-6 text-white/40 text-sm leading-relaxed font-sans"
                >
                  Tell us what you&apos;re building. We&apos;ll handle the rest — from strategy to execution.
                </Dialog.Description>
              </div>

              <div className="mt-10 flex flex-col gap-3">
                <a
                  href="mailto:hello@topview.agency"
                  className="text-white/50 text-xs font-sans hover:text-white transition-colors duration-300"
                >
                  hello@topview.agency
                </a>
                <span className="text-white/20 text-xs font-sans">Lagos · London</span>
              </div>
            </div>

            {/* Right — form */}
            <div className="flex-1 min-w-0 p-8 md:p-12 relative">
              <Dialog.Close className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center
                rounded-full border border-white/12 text-white/40
                hover:text-white hover:border-white/30 transition-all duration-300">
                <X size={14} strokeWidth={1.5} />
              </Dialog.Close>

              {sent ? (
                <div className="h-full min-h-65 flex flex-col items-center justify-center text-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10l4.5 4.5L16 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="display font-black uppercase text-white text-3xl">Sent.</p>
                  <p className="text-white/40 text-sm font-sans">We&apos;ll be in touch shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <label className="flex flex-col gap-2">
                      <span className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-sans">Name</span>
                      <input
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Your name"
                        className="bg-transparent border-b border-white/15 focus:border-white/50 outline-none
                          py-2.5 text-white placeholder-white/20 text-sm font-sans transition-colors duration-300"
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-sans">Email</span>
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="bg-transparent border-b border-white/15 focus:border-white/50 outline-none
                          py-2.5 text-white placeholder-white/20 text-sm font-sans transition-colors duration-300"
                      />
                    </label>
                  </div>

                  <div className="flex flex-col gap-3">
                    <span className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-sans">
                      I&apos;m reaching out about
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {inquiryTypes.map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setType(t)}
                          className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest
                            font-sans transition-all duration-300
                            ${type === t
                              ? "bg-white text-black"
                              : "border border-white/15 text-white/40 hover:text-white hover:border-white/35"
                            }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="flex flex-col gap-2">
                    <span className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-sans">Message</span>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Tell us about your project, timeline, or anything else..."
                      className="bg-transparent border-b border-white/15 focus:border-white/50 outline-none
                        py-2.5 text-white placeholder-white/20 text-sm font-sans resize-none
                        transition-colors duration-300 leading-relaxed"
                    />
                  </label>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-xs font-bold
                        uppercase tracking-widest bg-white text-black hover:bg-white/90
                        active:scale-95 transition-all duration-300"
                    >
                      Send Message
                      <ArrowUpRight size={14} strokeWidth={2} />
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
