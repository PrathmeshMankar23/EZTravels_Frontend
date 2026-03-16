"use client";

import React, { useState, useEffect } from "react";
import { api, EnquiryData } from "../../lib/api";

interface Props {
  destinationId?: string;
  destinationTitle?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const EnquireForm: React.FC<Props> = ({
  destinationId,
  destinationTitle,
  isOpen = false,
  onClose = () => {},
}) => {
  const [show, setShow] = useState(isOpen);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);

  const close = () => {
    setShow(false);
    setSubmitted(false);
    onClose();
  };

  const change = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data: EnquiryData = {
        ...form,
        destinationId,
      };

      await api.submitEnquiry(data);
      setSubmitted(true);
      setForm({ customerName: "", email: "", phone: "", message: "" });
    } catch {
      alert("Failed");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="enquiry-overlay" onClick={close}>
      <div
        className="enquiry-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="enquiry-close" onClick={close}>
          ✕
        </button>

        <h2 className="enquiry-title">
          Enquire for {destinationTitle}
        </h2>

        {submitted ? (
          <div className="enquiry-success">
            <div className="success-icon">✅</div>
            <p>Submitted successfully!</p>
            <button className="enquiry-submit" onClick={close}>
              Close
            </button>
          </div>
        ) : (
          <form className="enquiry-form" onSubmit={submit}>
            <input name="customerName" placeholder="Full Name" onChange={change} required />
            <input name="email" type="email" placeholder="Email Address" onChange={change} required />
            <input name="phone" placeholder="Phone Number" onChange={change} required />
            <textarea name="message" placeholder="Tell us about your trip..." onChange={change} />
            <button className="enquiry-submit" disabled={loading}>
              {loading ? "Sending..." : "Submit Enquiry"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EnquireForm;
