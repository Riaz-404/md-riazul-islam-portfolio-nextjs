"use client";

import { useState } from "react";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission - you can integrate with your preferred service
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section
      className="section"
      id="contact"
      data-aos="fade-up"
      style={{ padding: "100px 0" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div
              className="section-title text-center"
              style={{ marginBottom: "70px" }}
            >
              <span
                className="mb-0 text-uppercase text-sm"
                style={{
                  color: "#e1a34c",
                  letterSpacing: "4px",
                  fontSize: "14px",
                }}
              >
                <i className="ti-minus mr-2"></i>Contact
              </span>
              <h2
                className="title"
                style={{
                  fontSize: "70px",
                  lineHeight: "80px",
                  textTransform: "capitalize",
                  color: "#fff",
                  marginTop: "10px",
                }}
              >
                Get in Touch
              </h2>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <form
              className="form-row contact-form"
              onSubmit={handleSubmit}
              id="contactForm"
            >
              <div className="form-group col-lg-6 mb-5">
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control bg-transparent"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    border: "0px",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.25)",
                    paddingLeft: "0px",
                    fontSize: "18px",
                    background: "transparent",
                    color: "#fff",
                  }}
                />
              </div>
              <div className="form-group col-lg-6 mb-5">
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="form-control bg-transparent"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    border: "0px",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.25)",
                    paddingLeft: "0px",
                    fontSize: "18px",
                    background: "transparent",
                    color: "#fff",
                  }}
                />
              </div>
              <div className="form-group col-lg-12 mb-5">
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  className="form-control bg-transparent"
                  placeholder="Your Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  style={{
                    border: "0px",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.25)",
                    paddingLeft: "0px",
                    fontSize: "18px",
                    background: "transparent",
                    color: "#fff",
                  }}
                />
              </div>

              <div className="form-group col-lg-12 mb-5">
                <textarea
                  id="message"
                  name="message"
                  cols={30}
                  rows={6}
                  className="form-control bg-transparent"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  style={{
                    border: "0px",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.25)",
                    paddingLeft: "0px",
                    fontSize: "18px",
                    background: "transparent",
                    color: "#fff",
                    resize: "vertical",
                  }}
                ></textarea>
              </div>

              <div className="text-center col-lg-12 mb-5">
                <button
                  className="btn btn-main mt-5"
                  type="submit"
                  style={{ color: "#272727" }}
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
