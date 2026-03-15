-- Add campaign_type and beneficiary to campaigns
-- campaign_type: 'high_tip_drop' | 'cause_drop'
-- beneficiary: optional org/recipient name (e.g. "Santa Barbara Dog Rescue")

alter table campaigns
  add column if not exists campaign_type text not null default 'high_tip_drop'
    check (campaign_type in ('high_tip_drop', 'cause_drop')),
  add column if not exists beneficiary text;

-- Existing rows automatically get campaign_type = 'high_tip_drop' via default
