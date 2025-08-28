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
    <section className="section" id="contact">
      <MotionDiv
        className="container"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="section-title text-center">
              <span className="text-color mb-0 text-uppercase letter-spacing text-sm">
                <i className="ti-minus mr-2"></i>Contact
              </span>
              <h1 className="title">Get in Touch</h1>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            {submitStatus === "success" && (
              <div
                className="alert alert-success mb-4 text-center"
                style={{
                  backgroundColor: "rgba(225, 163, 76, 0.1)",
                  border: "1px solid #e1a34c",
                  color: "#e1a34c",
                  padding: "15px",
                  borderRadius: "5px",
                }}
              >
                Thank you! Your message has been sent successfully.
              </div>
            )}

            {submitStatus === "error" && (
              <div
                className="alert alert-danger mb-4 text-center"
                style={{
                  backgroundColor: "rgba(220, 53, 69, 0.1)",
                  border: "1px solid #dc3545",
                  color: "#dc3545",
                  padding: "15px",
                  borderRadius: "5px",
                }}
              >
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
                  <div className="col-lg-6 mb-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Your Name"
                              {...field}
                              className="contact-input"
                              style={{
                                border: "0px",
                                borderBottom:
                                  "1px solid rgba(255, 255, 255, 0.25)",
                                borderRadius: "0px",
                                paddingLeft: "0px",
                                fontSize: "18px",
                                background: "transparent",
                                color: "#fff",
                                height: "50px",
                              }}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 mt-2" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-lg-6 mb-5">
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
                              className="contact-input"
                              style={{
                                border: "0px",
                                borderBottom:
                                  "1px solid rgba(255, 255, 255, 0.25)",
                                borderRadius: "0px",
                                paddingLeft: "0px",
                                fontSize: "18px",
                                background: "transparent",
                                color: "#fff",
                                height: "50px",
                              }}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 mt-2" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-lg-12 mb-5">
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Your Subject"
                              {...field}
                              className="contact-input"
                              style={{
                                border: "0px",
                                borderBottom:
                                  "1px solid rgba(255, 255, 255, 0.25)",
                                borderRadius: "0px",
                                paddingLeft: "0px",
                                fontSize: "18px",
                                background: "transparent",
                                color: "#fff",
                                height: "50px",
                              }}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 mt-2" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-lg-12 mb-5">
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Your Message"
                              className="contact-textarea"
                              rows={6}
                              {...field}
                              style={{
                                border: "0px",
                                borderBottom:
                                  "1px solid rgba(255, 255, 255, 0.25)",
                                borderRadius: "0px",
                                paddingLeft: "0px",
                                fontSize: "18px",
                                background: "transparent",
                                color: "#fff",
                                resize: "vertical",
                                minHeight: "120px",
                              }}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 mt-2" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="text-center col-lg-12 mb-5">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-main text-white mt-5"
                      style={{
                        backgroundColor: "#e1a34c",
                        borderColor: "#e1a34c",
                        padding: "15px 40px",
                        fontSize: "16px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        transition: "all 0.3s ease",
                      }}
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
