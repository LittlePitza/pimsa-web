import type { ApplicationStatus, LeadStatus } from "@/lib/enums";
import { applicationStatusLabels, leadStatusLabels } from "@/lib/labels";
import { cn } from "@/lib/utils";

/**
 * Color-coded status pills. One tone per meaning, not per enum: green is
 * "needs attention", blue is "in progress", navy is "resolved", forest is
 * "success", neutral is "archived" — so a glance down a list reads as a
 * to-do, whatever the entity.
 */

type BadgeTone = "green" | "blue" | "navy" | "forest" | "neutral";

const toneClasses: Record<BadgeTone, string> = {
  green: "bg-green-500/15 text-green-600",
  blue: "bg-blue-600/10 text-blue-600",
  navy: "bg-navy-500/10 text-navy-500",
  forest: "bg-forest-800/10 text-forest-800",
  neutral: "bg-line/60 text-ink-muted",
};

const leadTones: Record<LeadStatus, BadgeTone> = {
  new: "green",
  contacted: "blue",
  closed: "navy",
};

const applicationTones: Record<ApplicationStatus, BadgeTone> = {
  new: "green",
  reviewing: "blue",
  finalist: "navy",
  hired: "forest",
  rejected: "neutral",
};

function Badge({ tone, children }: { tone: BadgeTone; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        toneClasses[tone],
      )}
    >
      {children}
    </span>
  );
}

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return <Badge tone={leadTones[status]}>{leadStatusLabels[status]}</Badge>;
}

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return <Badge tone={applicationTones[status]}>{applicationStatusLabels[status]}</Badge>;
}
