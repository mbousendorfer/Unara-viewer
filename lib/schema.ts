import { z } from "zod";

import { EVENT_TYPES } from "@/lib/types";

export const csvRowSchema = z.object({
  Type: z.string().trim(),
  "Start Date/time": z.string().trim(),
  "Start Date/time (Epoch)": z.string().trim(),
  Note: z.string().optional().default(""),
  "Time Zone": z.string().optional().default(""),
  _activityKey: z.string().trim(),
  "[Bottle Feed] Formula Volume": z.string().optional().default(""),
  "[Bottle Feed] Formula Volume Unit": z.string().optional().default(""),
  "[Bottle Feed] Type": z.string().optional().default(""),
  "[Bottle Feed] Breast Milk Volume": z.string().optional().default(""),
  "[Bottle Feed] Breast Milk Volume Unit": z.string().optional().default(""),
  "[Bottle Feed] Volume": z.string().optional().default(""),
  "[Bottle Feed] Volume Unit": z.string().optional().default(""),
  "[Sleep] Duration (Seconds)": z.string().optional().default(""),
  "[Sleep] End Date/time": z.string().optional().default(""),
  "[Diaper] Type": z.string().optional().default(""),
  "[Pump] Total Volume": z.string().optional().default(""),
  "[Pump] Total Volume Unit": z.string().optional().default(""),
  "[Pump] Left Volume": z.string().optional().default(""),
  "[Pump] Left Volume Unit": z.string().optional().default(""),
  "[Pump] Right Volume": z.string().optional().default(""),
  "[Pump] Right Volume Unit": z.string().optional().default(""),
  "[Pump] Duration (Seconds)": z.string().optional().default(""),
  "[Growth] Weight": z.string().optional().default(""),
  "[Growth] Height": z.string().optional().default(""),
  "[Growth] Head Size": z.string().optional().default(""),
  "[Routine] Routine": z.string().optional().default(""),
  "[Baby First] Baby First": z.string().optional().default(""),
  "[Medical] Temperature": z.string().optional().default(""),
  "[Vaccine] Vaccine": z.string().optional().default(""),
  "[Breastfeed] Begin Side": z.string().optional().default(""),
  "[Breastfeed] End Side": z.string().optional().default(""),
  "[Breastfeed] Left Duration (Seconds)": z.string().optional().default(""),
  "[Breastfeed] Right Duration (Seconds)": z.string().optional().default(""),
});

export const eventTypeSchema = z.enum(EVENT_TYPES);
