-- Treasury snapshot
insert into treasury_snapshots (balance_sol, balance_usd, sol_price, snapshot_at)
values (12.5, 2187.50, 175.00, now());

-- Sample campaigns
insert into campaigns (
  slug, title, description, date, category, platform,
  campaign_type, beneficiary,
  subtotal, tip, total,
  treasury_tx, receipt_image_url, social_post_url, notes, published
)
values
(
  'high-tip-drop-maria-g-260310',
  'High-Tip Drop — Maria G.',
  'The GIGGYBANK treasury funded a $200 surprise tip on Maria''s DoorDash delivery. Maria has been on the platform for 3 years with a 4.9 rating. High-Tip Drops exist to give gig workers the recognition their platform payouts rarely include.',
  '2026-03-10',
  'food',
  'DoorDash',
  'high_tip_drop',
  null,
  18.75, 200.00, 218.75,
  null,
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop',
  null,
  null,
  true
),
(
  'high-tip-drop-james-t-260305',
  'High-Tip Drop — James T.',
  'James worked a double shift delivering on DoorDash to cover rent. The GIGGYBANK treasury funded a $150 surprise tip — more than 6x his delivery pay for the order. High-Tip Drops are how the community says thank you at a scale that actually matters.',
  '2026-03-05',
  'food',
  'DoorDash',
  'high_tip_drop',
  null,
  22.40, 150.00, 172.40,
  null,
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop',
  null,
  null,
  true
),
(
  'petco-cause-drop-sb-dog-rescue-260228',
  'Petco Cause Drop — Dog Rescue',
  'GiggyBank funded a supply delivery of dog food and essentials for a local rescue organization. Cause Drops direct treasury funds toward real-world community needs beyond individual workers.',
  '2026-02-28',
  'supplies',
  'Instacart',
  'cause_drop',
  'Santa Barbara Dog Rescue',
  145.00, 40.00, 185.00,
  null,
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop',
  null,
  null,
  true
);
