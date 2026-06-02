"use client";

import { useState } from "react";
import { SectionTitle, SubTitle, Bullet, Card } from "@/components/ui/PRDComponents";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Your name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormData) => {
    console.log("Contact form submitted:", data);
    // In Phase 1, we just log to console and simulate submission.
    // In Phase 2, this would send an email or store in a CRM.
    setSubmitted(true);
    reset();
    // Optionally, reset after a few seconds
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="container mx-auto px-4 py-8 text-text-secondary">
      <SectionTitle>Get In Touch</SectionTitle>
      <p className="mb-8 text-lg leading-relaxed">
        Have a question, feedback, or just want to say hello? Fill out the form below or reach us directly via WhatsApp.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <SubTitle>Send Us a Message</SubTitle>
          <Card>
            {submitted && (
              <div className="mb-4 p-4 bg-gold-muted text-text-primary text-center">
                Thank you for your message! We'll get back to you shortly.
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Your Name"
                type="text"
                id="name"
                {...register("name")}
                error={errors.name?.message}
              />
              <Input
                label="Your Email"
                type="email"
                id="email"
                {...register("email")}
                error={errors.email?.message}
              />
              <Input
                label="Subject"
                type="text"
                id="subject"
                {...register("subject")}
                error={errors.subject?.message}
              />
              <Input
                label="Your Message"
                type="textarea"
                id="message"
                rows={5}
                {...register("message")}
                error={errors.message?.message}
              />
              <Button type="submit" variant="primary" className="w-full">
                Send Message
              </Button>
            </form>
          </Card>
        </div>

        <div>
          <SubTitle>Other Ways to Connect</SubTitle>
          <Card accent>
            <Bullet>
              <strong>WhatsApp:</strong> <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-gold-primary hover:underline">{process.env.NEXT_PUBLIC_WA_NUMBER || "+234 800 000 0000"}</a>
            </Bullet>
            <Bullet>
              <strong>Email:</strong> <a href="mailto:info@abundanceclothing.com" className="text-gold-primary hover:underline">info@abundanceclothing.com</a>
            </Bullet>
            <Bullet>
              <strong>Address:</strong> Lagos, Nigeria (Details for pickup provided on order confirmation)
            </Bullet>
            <Bullet>
              <strong>Social Media:</strong> Find us on Instagram and Twitter @AbundanceClothing
            </Bullet>
          </Card>

          <SubTitle>Business Hours</SubTitle>
          <Card>
            <Bullet>Monday - Friday: 9:00 AM - 5:00 PM WAT</Bullet>
            <Bullet>Saturday: 10:00 AM - 2:00 PM WAT</Bullet>
            <Bullet>Sunday: Closed</Bullet>
          </Card>
        </div>
      </div>
    </div>
  );
}
