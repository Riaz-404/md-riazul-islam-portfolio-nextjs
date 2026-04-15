"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
  message: z.string().min(1, { message: "Message is required." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

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
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="py-24 lg:py-32">
      {/* Subtle ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-primary/4 blur-[120px]" />
      </div>

      <div className="container">
        <MotionDiv
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          {/* ── Section Header ── */}
          <div className="text-center space-y-4 mb-12">
            <p className="text-primary text-sm font-semibold uppercase tracking-[0.15em]">
              Contact
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Let&apos;s Build Something
              <br />
              <span className="gradient-text">Great Together</span>
            </h2>
            <p className="text-muted-foreground text-base lg:text-lg max-w-md mx-auto">
              Have a project in mind, a question, or just want to say hi?
              I&apos;d love to hear from you.
            </p>
          </div>

          {/* ── Status Messages ── */}
          {submitStatus === "success" && (
            <MotionDiv
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-6 p-4 rounded-xl border border-primary/20 bg-primary/8 text-primary text-sm font-medium"
            >
              <CheckCircle className="h-5 w-5 shrink-0" />
              <span>Message sent! I&apos;ll get back to you soon.</span>
            </MotionDiv>
          )}

          {submitStatus === "error" && (
            <MotionDiv
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-6 p-4 rounded-xl border border-destructive/20 bg-destructive/8 text-destructive text-sm font-medium"
            >
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>Something went wrong. Please try again.</span>
            </MotionDiv>
          )}

          {/* ── Form ── */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Your Name"
                          {...field}
                          className="contact-input h-12 rounded-xl border border-border bg-card px-4 text-base placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-colors"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive text-xs mt-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Your Email"
                          {...field}
                          className="contact-input h-12 rounded-xl border border-border bg-card px-4 text-base placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-colors"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive text-xs mt-1" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Subject */}
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Subject"
                        {...field}
                        className="contact-input h-12 rounded-xl border border-border bg-card px-4 text-base placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-colors"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-xs mt-1" />
                  </FormItem>
                )}
              />

              {/* Message */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Tell me about your project or idea..."
                        rows={5}
                        {...field}
                        className="contact-textarea rounded-xl border border-border bg-card px-4 py-3 text-base placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-colors resize-none"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-xs mt-1" />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base shadow-md hover:shadow-lg transition-all duration-200 group"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Send Message
                    <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </MotionDiv>
      </div>
    </section>
  );
}
