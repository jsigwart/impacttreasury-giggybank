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
  'doordash-drop-food-260310',
  'DoorDash High-Tip Drop — Food Delivery',
  'GiggyBank placed a food delivery order on DoorDash with a $200 tip funded by the treasury. DoorDash routed the order to a driver, who received the full tip on completion. The platform determines which worker gets the job — GiggyBank funds the drop.',
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
  'doordash-drop-grocery-260305',
  'DoorDash High-Tip Drop — Grocery Order',
  'GiggyBank placed a grocery order on DoorDash with a $150 tip funded by the treasury. DoorDash assigned the order to a shopper, who received the full tip on completion — more than 6x the standard delivery pay for the order.',
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
