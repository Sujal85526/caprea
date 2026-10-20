-- Initial catalogue from Caprea's PDFs ("Caprea Catering Packages", "The Oasis Edition" menu).
-- Safe to re-run: clears the catalogue tables first; bookings are untouched.

delete from public.menu_items;
delete from public.packages;
delete from public.cup_tiers;
delete from public.regions;
delete from public.extras;

insert into public.admins (email) values
  ('rajputsujal098@gmail.com'),
  ('capreawebsite@gmail.com')
on conflict do nothing;

insert into public.settings (id, terms) values (true, '[
  {"title": "Booking confirmation", "body": "Your event date is confirmed once we receive a 50% non-refundable deposit."},
  {"title": "Final payment", "body": "The remaining balance is due in full no later than 24 hours before the event."},
  {"title": "Service duration", "body": "Our service includes 4 hours on site, including setup and pack-down. Extra time is AED 150 per hour."},
  {"title": "Venue requirements", "body": "Please provide access to a working electrical outlet and a washing area with running water."},
  {"title": "Additional cups", "body": "Extra cups must be agreed with the barista before service begins and paid for before the event starts."},
  {"title": "Changes & cancellations", "body": "Changes must be shared at least 72 hours before the event. Deposits are non-refundable."}
]'::jsonb)
on conflict (id) do update set terms = excluded.terms;

insert into public.packages (name, guests, max_signature_drinks, cups_per_drink, price, featured, sort) values
  ('Intimate',   30,  3,  5, 1200, false, 1),
  ('Gathering',  60,  5,  6, 1900, false, 2),
  ('Celebration', 100, 6,  9, 2800, true,  3),
  ('Grand',      200, 6, 15, 4600, false, 4),
  ('Signature',  300, 6, 25, 6500, false, 5);

insert into public.cup_tiers (label, min_cups, max_cups, price_per_cup, sort) values
  ('30 – 99 cups', 30, 99, 30, 1),
  ('100+ cups', 100, null, 26, 2);

insert into public.regions (name, fee, sort) values
  ('Abu Dhabi', 180, 1),
  ('Al Ain', 500, 2),
  ('Dubai', 500, 3),
  ('Sharjah', 500, 4),
  ('Ajman', 500, 5);

insert into public.extras (slug, name, description, price, unit, sort) values
  ('custom-cups', 'Customised cups', 'Your names, date or logo printed on every cup.', 250, 'flat', 1),
  ('custom-corner', 'Customised corner', 'A styled Caprea corner dressed for your theme.', 200, 'flat', 2),
  ('extra-hour', 'Additional hour', 'Keep the cart serving longer.', 150, 'per_hour', 3),
  ('extra-cups', 'Extra cups', 'More servings beyond your package.', null, 'on_request', 4);

insert into public.menu_items
  (slug, name, description, category, price, image_url, best_seller, catering_signature, catering_coffee, catering_addon, addon_price, sort)
values
  -- Matcha
  ('matcha-latte', 'Matcha Latte', 'Ceremonial-grade matcha over cold milk.', 'matcha', 30, '/menu/matcha-latte.webp', false, true, false, false, null, 10),
  ('salted-vanilla-matcha', 'Salted Vanilla Matcha', 'Matcha layered on salted vanilla cream.', 'matcha', 39, '/menu/salted-vanilla-matcha.webp', true, false, false, false, null, 11),
  ('milky-matcha', 'Milky Matcha', 'Silky, mellow and just sweet enough.', 'matcha', 35, '/menu/milky-matcha.webp', false, false, false, false, null, 12),
  ('cloudy-matcha', 'Cloudy Matcha', 'Whipped matcha cloud over coconut water.', 'matcha', 35, '/menu/cloudy-matcha.webp', false, false, false, false, null, 13),
  ('strawberry-matcha', 'Strawberry Matcha', 'Strawberry cream poured over matcha.', 'matcha', 35, '/menu/strawberry-matcha.webp', false, false, false, false, null, 14),
  -- Smoothies
  ('acai-smoothie', 'Acai Smoothie', 'Acai, berries and banana.', 'smoothie', 40, '/menu/acai-smoothie.webp', true, true, false, false, null, 20),
  ('berry-obsessed', 'Berry Obsessed', 'A bright mixed-berry blend.', 'smoothie', 32, '/menu/berry-obsessed.webp', false, false, false, false, null, 21),
  ('golden-hour', 'Golden Hour', 'Mango and passion fruit sunshine.', 'smoothie', 32, '/menu/golden-hour.webp', false, true, false, false, null, 22),
  ('cloud-nine', 'Cloud Nine', 'Blue spirulina, banana and coconut.', 'smoothie', 32, '/menu/cloud-nine.webp', false, true, false, false, null, 23),
  -- Refreshers
  ('velvet-sunset', 'Velvet Sunset', 'Our hibiscus berry refresher.', 'refresher', 30, '/menu/velvet-sunset.webp', true, true, false, false, null, 30),
  ('peach-iced-tea', 'Peach Iced Tea', 'Brewed tea with ripe peach.', 'refresher', 30, '/menu/peach-iced-tea.webp', false, true, false, false, null, 31),
  -- Coffee
  ('spanish-latte', 'Spanish Latte', 'Espresso with sweet condensed milk.', 'coffee', 30, '/menu/spanish-latte.webp', false, false, true, false, null, 40),
  ('salted-caramel-latte', 'Salted Caramel Latte', 'House salted caramel and espresso.', 'coffee', 30, '/menu/salted-caramel-latte.webp', false, false, false, false, null, 41),
  ('v60', 'V60', 'Single-origin pour-over, hot or iced.', 'coffee', 30, '/menu/v60.webp', true, false, true, false, null, 42),
  ('americano', 'Americano', 'Espresso lengthened with water.', 'coffee', 30, '/menu/americano.webp', false, false, true, false, null, 43),
  ('latte', 'Latte', 'Espresso and steamed milk.', 'coffee', 26, '/menu/iced-latte.webp', false, false, true, false, null, 44),
  ('flat-white', 'Flat White', 'A short, velvety double shot.', 'coffee', 25, '/menu/flat-white.webp', false, false, true, false, null, 45),
  ('cortado', 'Cortado', 'Equal parts espresso and milk.', 'coffee', 25, '/menu/cortado.webp', false, false, true, false, null, 46),
  ('dirty-espresso', 'Dirty Espresso', 'A shot poured over cold milk.', 'coffee', 28, '/menu/dirty-espresso.webp', true, false, false, false, null, 47),
  -- Desserts and add-ons
  ('strawberries-24k', '24K Strawberries', 'Chocolate-dipped strawberries with gold.', 'dessert', 23, '/menu/strawberries-24k.webp', false, false, false, true, 20, 50),
  ('krispy-treat', 'Krispy Treat', 'Chocolate crisp pearls in a cup.', 'dessert', 20, '/menu/krispy-treat.webp', false, false, false, true, 20, 51),
  ('milk-chocolate-cookie', 'Milk Chocolate Cookie', 'Thick, gooey and loaded.', 'dessert', 25, '/menu/milk-chocolate-cookie.webp', false, false, false, true, 22, 52),
  ('white-chocolate-cookie', 'White Chocolate Cookie', 'Matcha dough with white chocolate.', 'dessert', 25, '/menu/white-chocolate-cookie.webp', false, false, false, true, 22, 53),
  ('biscoff-cookie', 'Biscoff Cookie', 'Lotus spread and Biscoff crumble.', 'dessert', 25, '/menu/biscoff-cookie.webp', false, false, false, true, 22, 54),
  ('smores-cookie', 'S''mores Cookie', 'Torched marshmallow on chocolate.', 'dessert', 25, '/menu/smores-cookie.webp', true, false, false, true, 22, 55),
  ('caprea-coconut', 'Caprea Coconut', 'Fresh young coconut, branded.', 'dessert', 25, '/menu/caprea-coconut.webp', false, false, false, true, 25, 56),
  ('aseeda-bites', 'Aseeda Bites (3 pcs)', 'An Emirati classic, reimagined.', 'dessert', 20, '/menu/aseeda-bites.webp', false, false, false, false, null, 57),
  ('banana-pudding', 'Banana Pudding', 'Layers of custard, banana and biscuit.', 'dessert', 20, '/menu/banana-pudding.webp', false, false, false, false, null, 58),
  -- Gathering boxes
  ('matcha-gathering-box', 'Matcha Gathering Box', 'Everything to whisk matcha for your group.', 'box', 170, '/photos/matcha-bowl.webp', false, false, false, false, null, 60),
  ('spanish-latte-gathering-box', 'Spanish Latte Gathering Box', 'Spanish latte to share, ready to pour.', 'box', 150, '/photos/iced-latte-pour.webp', false, false, false, false, null, 61),
  ('v60-gathering-box', 'V60 Gathering Box', 'Freshly brewed V60 for the table.', 'box', 130, '/photos/v60-pour.webp', false, false, false, false, null, 62);
