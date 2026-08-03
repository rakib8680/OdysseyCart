"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Send, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { submitContactForm } from "@/app/actions/contact";
import {
  contactFormSchema,
  SUPPORT_SUBJECTS,
  type ContactFormInput,
} from "@/lib/validations/contact";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";
import { FormInput } from "@/components/form/FormInput";
import { FormTextArea } from "@/components/form/FormTextArea";
import { FormSelect } from "@/components/form/FormSelect";

export function ContactForm() {
  const { user, dbUser } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "General Inquiry",
      orderNumber: "",
      message: "",
    },
  });

  // Pre-fill Name & Email for authenticated users
  useEffect(() => {
    if (user || dbUser) {
      const nameVal = dbUser?.name || user?.displayName || "";
      const emailVal = user?.email || dbUser?.email || "";
      if (nameVal) setValue("name", nameVal, { shouldValidate: true });
      if (emailVal) setValue("email", emailVal, { shouldValidate: true });
    }
  }, [user, dbUser, setValue]);

  const messageText = watch("message", "");
  const messageLength = messageText.length;

  const onSubmit = async (data: ContactFormInput) => {
    try {
      const response = await submitContactForm(data);

      if (response.success) {
        toast.success("Message sent successfully!", {
          description: "Our support team will respond within 24 hours.",
        });
        setIsSubmitted(true);
        reset();
      } else {
        toast.error("Failed to send message", {
          description: response.message,
        });
      }
    } catch (err) {
      toast.error("An unexpected error occurred", {
        description: "Please try again later.",
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-center shadow-sm">
        <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Message Received!
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
          Thank you for reaching out to OdysseyCart. A customer experience specialist has received your inquiry and will follow up with you via email shortly.
        </p>
        <Button
          onClick={() => setIsSubmitted(false)}
          variant="outline"
          className="rounded-lg text-xs uppercase tracking-wider font-semibold"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-5"
    >
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
          Send Us a Message
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Fill out the form below and we'll respond to your email as soon as possible.
        </p>
      </div>

      {/* Name & Email Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          {...register("name")}
          id="contact-name"
          label="Full Name *"
          placeholder="John Doe"
          error={errors.name?.message}
        />

        <FormInput
          {...register("email")}
          id="contact-email"
          type="email"
          label="Email Address *"
          placeholder="john@example.com"
          error={errors.email?.message}
        />
      </div>

      {/* Subject Dropdown & Order Number */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormSelect
          {...register("subject")}
          id="contact-subject"
          label="Inquiry Subject *"
          options={SUPPORT_SUBJECTS}
          error={errors.subject?.message}
        />

        <FormInput
          {...register("orderNumber")}
          id="contact-order-number"
          label="Order Number (optional)"
          placeholder="e.g. #OD-84920A"
          error={errors.orderNumber?.message}
        />
      </div>

      {/* Message Textarea */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-slate-400 font-normal">
            Character limit
          </span>
          <span
            className={`text-xs ${
              messageLength > 1000 ? "text-red-500 font-bold" : "text-slate-400"
            }`}
          >
            {messageLength} / 1000
          </span>
        </div>
        <FormTextArea
          {...register("message")}
          id="contact-message"
          label="Message *"
          rows={5}
          placeholder="Please describe how we can help you in detail..."
          error={errors.message?.message}
          className="resize-none"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Spinner className="w-4 h-4 text-white" />
            <span>Sending Message...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Send Message</span>
          </>
        )}
      </Button>
    </form>
  );
}
