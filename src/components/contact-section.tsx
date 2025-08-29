"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
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
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  email: z
    .string()
    .min(1, {
      message: "Email is required.",
    })
    .email({
      message: "Please enter a valid email address.",
    }),
  subject: z.string().min(1, {
    message: "Subject is required.",
  }),
  message: z.string().min(1, {
    message: "Message is required.",
  }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("https://formspree.io/f/mnnbneon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    <section className="section py-24 lg:py-32" id="contact">
      <MotionDiv
        className="container"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="section-title text-center mb-20">
              <span className="text-primary mb-4 inline-block text-uppercase tracking-widest text-sm font-medium">
                <i className="ti-minus mr-2"></i>Contact
              </span>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight">
                Get in Touch
              </h1>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-6">
            {submitStatus === "success" && (
              <div className="mb-6 p-4 text-center rounded-md border border-primary/20 bg-primary/10 text-primary">
                Thank you! Your message has been sent successfully.
              </div>
            )}

            {submitStatus === "error" && (
              <div className="mb-6 p-4 text-center rounded-md border border-red-500/20 bg-red-500/10 text-red-500">
                Sorry, there was an error sending your message. Please try
                again.
              </div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="contact-form"
              >
                <div className="row">
                  <div className="col-lg-6 mb-8">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Your Name"
                              {...field}
                              className="contact-input border-0 border-b border-border/25 rounded-none pl-0 text-lg bg-transparent text-foreground h-12 placeholder:text-muted-foreground/70 focus:border-primary hover:border-primary transition-colors duration-300"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 mt-2" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-lg-6 mb-8">
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
                              className="contact-input border-0 border-b border-border/25 rounded-none pl-0 text-lg bg-transparent text-foreground h-12 placeholder:text-muted-foreground/70 focus:border-primary hover:border-primary transition-colors duration-300"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 mt-2" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-lg-12 mb-8">
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Your Subject"
                              {...field}
                              className="contact-input border-0 border-b border-border/25 rounded-none pl-0 text-lg bg-transparent text-foreground h-12 placeholder:text-muted-foreground/70 focus:border-primary hover:border-primary transition-colors duration-300"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 mt-2" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-lg-12 mb-8">
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Your Message"
                              className="contact-textarea border-0 border-b border-border/25 rounded-none pl-0 text-lg bg-transparent text-foreground min-h-[120px] resize-y placeholder:text-muted-foreground/70 focus:border-primary hover:border-primary transition-colors duration-300"
                              rows={6}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 mt-2" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="text-center col-lg-12 mb-8">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-main mt-12 px-11 py-3 text-lg font-normal tracking-wide uppercase transition-all duration-200 ease-in-out hover:bg-transparent hover:text-foreground hover:border-border/20"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </MotionDiv>
    </section>
  );
}
