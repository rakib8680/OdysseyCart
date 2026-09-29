import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { HOMEPAGE_TOKENS } from "@/lib/config/homepage";

export interface SectionHeaderAction {
  label: string;
  href: string;
}

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: SectionHeaderAction;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  children?: React.ReactNode;
  headingLevel?: "h1" | "h2" | "h3";
}

/**
 * Standardized SectionHeader Component for OdysseyCart Homepage V2.
 *
 * Implements centralized design tokens for consistent typography, spacing,
 * and navigation links across all landing page sections.
 */
export function SectionHeader({
  title,
  subtitle,
  action,
  align = "left",
  className,
  titleClassName,
  subtitleClassName,
  children,
  headingLevel: Heading = "h2",
}: SectionHeaderProps) {
  if (align === "center") {
    return (
      <div
        className={cn(
          "text-center max-w-2xl mx-auto",
          HOMEPAGE_TOKENS.typography.sectionHeaderMargin,
          className,
        )}
      >
        <Heading
          className={cn(
            HOMEPAGE_TOKENS.typography.sectionTitle,
            titleClassName,
          )}
        >
          {title}
        </Heading>
        {subtitle && (
          <p
            className={cn(
              HOMEPAGE_TOKENS.typography.sectionSubtitle,
              "mx-auto",
              subtitleClassName,
            )}
          >
            {subtitle}
          </p>
        )}
        {children && <div className="mt-4 flex justify-center">{children}</div>}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-end justify-between gap-4",
        HOMEPAGE_TOKENS.typography.sectionHeaderMargin,
        className,
      )}
    >
      <div>
        <Heading
          className={cn(
            HOMEPAGE_TOKENS.typography.sectionTitle,
            titleClassName,
          )}
        >
          {title}
        </Heading>
        {subtitle && (
          <p
            className={cn(
              HOMEPAGE_TOKENS.typography.sectionSubtitle,
              subtitleClassName,
            )}
          >
            {subtitle}
          </p>
        )}
      </div>

      {(action || children) && (
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 pt-1 sm:pt-0">
          {action && (
            <Link
              href={action.href}
              className="group inline-flex items-center text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-900 hover:text-emerald-600 transition-colors"
            >
              <span>{action.label}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
