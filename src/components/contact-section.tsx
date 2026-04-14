"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { ArrowRight, CheckCircle, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MotionDiv } from "@/components/motion/motion-html-element";

const contactFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please enter a valid email address." }),
  subject: z.string().min(1, { message: "Subject is required." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const TRUST_POINTS = [
  "Respond within 24 hours",
  "Available for full-time & contract",
  "Remote-first collaboration",
];

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      const response = await fetch("https://formspree.io/f/mnnbneon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Name: data.name,
          Email: data.email,
          Subject: data.subject,
          Message: data.message,
        }),
      });
      if (response.ok) {
        setSubmitStatus("success");
        form.reset();
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      className="relative py-24 lg:py-32 overflow-hidden bg-muted/25 border-t border-border/40"
      id="contact"
    >
      {/* Background */}
      <div className="absolute inset-0 dot-grid opacity-[0.3]" />
      <div className="absolute inset-0 mesh-bg" />

      <div className="relative z-10 max-w-6xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: CTA copy */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease }}
            className="space-y-8"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary mb-4">
                Get in Touch
              </p>
              <h2 className="text-4xl lg:text-5xl xl:text-[3.5rem] font-extrabold tracking-tight text-foreground leading-[1.05]">
                Let&apos;s build{" "}
                <span className="gradient-text">something</span>
                <br />
                great together.
              </h2>
              <p className="mt-5 text-muted-foreground text-base lg:text-[17px] leading-relaxed max-w-md">
                Whether you need a full-stack engineer, a technical partner for
                your startup, or someone to bring your product vision to life —
                I&apos;m here.
              </p>
            </div>

            {/* Email CTA */}
            <a
              href="mailto:riazulislam.dev@gmail.com"
              className="inline-flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-0.5">
                  Or email directly
                </p>
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  riazulislam.dev@gmail.com
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all ml-1" />
            </a>

            {/* Trust indicators */}
            <ul className="space-y-3 pt-2">
              {TRUST_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-3 text-sm text-muted-foreground"
                >
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </MotionDiv>

          {/* Right: Contact form */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.12, ease }}
            className="bg-card rounded-2xl border border-border/60 p-8 shadow-sm"
          >
            {submitStatus === "success" ? (
              <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <CheckCircle className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Message sent!
                </h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Thanks for reaching out. I&apos;ll get back to you within 24
                  hours.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setSubmitStatus("idle")}
                >
                  Send another
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Name <span className="text-primary">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your name"
                              {...field}
                              className="h-11 bg-background border-border/60 focus:border-primary transition-colors text-sm rounded-xl"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Email <span className="text-primary">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="your@email.com"
                              {...field}
                              className="h-11 bg-background border-border/60 focus:border-primary transition-colors text-sm rounded-xl"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Subject <span className="text-primary">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="What's this about?"
                            {...field}
                            className="h-11 bg-background border-border/60 focus:border-primary transition-colors text-sm rounded-xl"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Message <span className="text-primary">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell me about your project, timeline, and what you're looking for..."
                            rows={5}
                            {...field}
                            className="bg-background border-border/60 focus:border-primary transition-colors text-sm resize-none rounded-xl min-h-[130px]"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  {submitStatus === "error" && (
                    <p className="text-sm text-destructive bg-destructive/8 border border-destructive/20 rounded-xl px-4 py-3">
                      Something went wrong. Please try again or email me
                      directly.
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2 text-base transition-all duration-200 rounded-xl"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}
