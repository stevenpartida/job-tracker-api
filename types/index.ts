export type ApplicationStatus =
  | "not_applied"
  | "applied"
  | "phone_screen"
  | "interview"
  | "offer"
  | "rejected"
  | "ghosted";
export type ApplicationWorkModel = "on_site" | "remote" | "hybrid";
export type ApplicationPriority = "high" | "medium" | "low";

export type ConnectionType =
  | "alumni"
  | "referral"
  | "recruiter"
  | "meetup"
  | "cold_outreach"
  | "other";

export type Company = {
  id: string;
  name: string;
  location?: string;
  industry?: string;
  websiteUrl?: string;
  engineerBlogUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateCompanyInput = {
  name: string;
  location?: string;
  industry?: string;
  websiteUrl?: string;
  engineerBlogUrl?: string;
  notes?: string;
};

export type Application = {
  id: string;
  companyId: string;
  referralContactId?: string;
  roleTitle: string;
  jobUrl: string;
  techStack?: string[];
  workModel: ApplicationWorkModel;
  status: ApplicationStatus;
  dateFound?: string;
  dateApplied?: string;
  salaryMin?: number;
  salaryMax?: number;
  priority: ApplicationPriority;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateApplicationInput = {
  referralContactId?: string;
  roleTitle: string;
  jobUrl?: string;
  techStack?: string[];
  workModel?: ApplicationWorkModel;
  status?: ApplicationStatus;
  dateFound?: string;
  dateApplied?: string;
  salaryMin?: number;
  salaryMax?: number;
  priority?: ApplicationPriority;
  notes?: string;
};

export type Contact = {
  id: string;
  companyId: string;
  name: string;
  role?: string;
  email?: string;
  linkedInUrl?: string;
  connectionType: ConnectionType;
  lastContact?: string;
  followUpDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateContactInput = {
  name: string;
  role?: string;
  email?: string;
  linkedInUrl?: string;
  connectionType?: ConnectionType;
  lastContact?: string;
  followUpDate?: string;
  notes?: string;
};
