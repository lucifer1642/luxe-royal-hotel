const db = require('./db');

async function createTables() {
  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'user'
    );
  `;
  const roomsTable = `
    CREATE TABLE IF NOT EXISTS rooms (
      id SERIAL PRIMARY KEY,
      room_type VARCHAR(100) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      description TEXT,
      status VARCHAR(20) DEFAULT 'available',
      image_url VARCHAR(255),
      features JSONB
    );
  `;
  const menusTable = `
    CREATE TABLE IF NOT EXISTS menu_items (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      category VARCHAR(50),
      image_url VARCHAR(255)
    );
  `;
  const bookingsTable = `
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
      check_in_date DATE NOT NULL,
      check_out_date DATE NOT NULL,
      total_price DECIMAL(10, 2) NOT NULL,
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // SEED DATA
  const seedRooms = `
    INSERT INTO rooms (room_type, price, description, status, image_url, features)
    VALUES 
    ('Ocean View Suite', 45000.00, 'Experience ultimate luxury with panoramic views. This suite features a king-size bed, a separate living area, and a marble bathroom with a deep soaking tub.', 'available', 'https://loremflickr.com/800/500/luxury-room,ocean-view/1', '["Premium WiFi", "24/7 Room Service", "Private Balcony"]'),
    ('Presidential Villa', 150000.00, 'Our most exclusive accommodation. The Presidential Villa offers ultimate privacy with its own private pool, personal butler, and expansive living quarters.', 'available', 'https://loremflickr.com/800/500/luxury-villa,pool/2', '["Private Pool", "Personal Butler Services", "Complimentary Spa Access"]'),
    ('Deluxe Royal Room', 32000.00, 'Elegant and comfortable, featuring heritage Rajputana architecture perfect for a prestigious getaway.', 'available', 'https://loremflickr.com/800/500/luxury-hotel-room/3', '["Smart TV", "Mini Bar", "Luxury Toiletries"]')
  `;

  const seedMenu = `
    INSERT INTO menu_items (name, description, price, category, image_url)
    VALUES 
    -- Starters
    ('Gold-Leaf Galouti Kebab', 'Melt-in-mouth lamb patties infused with 16 royal spices, smoked with cloves, wrapped in silver warq.', 2500.00, 'Starters', 'https://loremflickr.com/600/400/indian,kebab/1'),
    ('Truffle Butter Chicken Samosa', 'Hand-rolled pastry pillows stuffed with slow-cooked shredded butter chicken and Italian black truffle shavings.', 1800.00, 'Starters', 'https://loremflickr.com/600/400/indian,samosa/2'),
    ('Peshawari Paneer Tikka', 'Charcoal-grilled cottage cheese marinated in hung curd, yellow chili, and roasted gram flour.', 1500.00, 'Starters', 'https://loremflickr.com/600/400/indian,paneer/3'),
    ('Saffron Tandoori Jhinga', 'Jumbo tiger prawns marinated with wild Kashmiri saffron and thick yogurt, cooked in a clay oven.', 3200.00, 'Starters', 'https://loremflickr.com/600/400/indian,prawns/4'),
    ('Dahi Puri Caviar', 'Crispy semolina shells filled with spiced potatoes, sweet yogurt, and topped with Beluga caviar.', 2800.00, 'Starters', 'https://loremflickr.com/600/400/indian,street-food/5'),
    ('Murg Malai Tikka', 'Tender chicken marinated in fresh cream, mild spices, and cardamom, grilled flawlessly.', 1600.00, 'Starters', 'https://loremflickr.com/600/400/indian,chicken,tikka/6'),
    ('Avocado Papdi Chaat', 'A modern twist on a classic, featuring mashed avocado, crisp wafers, mint chutney, and tamarind glaze.', 1400.00, 'Starters', 'https://loremflickr.com/600/400/indian,snack/7'),
    ('Lobster Shorba', 'A fragrant, slow-simmered seafood broth infused with coastal Indian spices and sweet lobster meat.', 2100.00, 'Starters', 'https://loremflickr.com/600/400/indian,soup/8'),
    
    -- Mains Vegetarian
    ('Dal Bukhara', 'Black lentils simmered overnight on a slow charcoal fire, finished with cream and unsalted butter.', 1800.00, 'Mains (Vegetarian)', 'https://loremflickr.com/600/400/indian,dal/9'),
    ('Morel Mushroom Pulav', 'Aromatic basmati rice steamed with wild Himalayan morel mushrooms and saffron threads.', 2200.00, 'Mains (Vegetarian)', 'https://loremflickr.com/600/400/indian,rice,pulav/10'),
    ('Paneer Lababdar', 'Cottage cheese cubes tossed in a rich, creamy tomato and cashew gravy with a hint of fenugreek.', 1900.00, 'Mains (Vegetarian)', 'https://loremflickr.com/600/400/indian,paneer,gravy/11'),
    ('Malai Kofta', 'Cottage cheese and potato dumplings in a velvety, cashew-enriched white gravy.', 1800.00, 'Mains (Vegetarian)', 'https://loremflickr.com/600/400/indian,curry,vegetarian/12'),
    ('Dum Aloo Kashmiri', 'Baby potatoes slow-cooked in a vibrant, spiced yogurt gravy native to the Kashmir valley.', 1600.00, 'Mains (Vegetarian)', 'https://loremflickr.com/600/400/indian,potato,curry/13'),
    ('Pindi Chole', 'Robust and spicy chickpeas cooked dry with robust Punjabi spices.', 1500.00, 'Mains (Vegetarian)', 'https://loremflickr.com/600/400/indian,chickpeas/14'),
    ('Bhindi Amchoor', 'Crispy fried okra dusted with dried mango powder and roasted cumin.', 1400.00, 'Mains (Vegetarian)', 'https://loremflickr.com/600/400/indian,okra/15'),
    ('Baingan Bharta', 'Smoked eggplant mashed with onions, tomatoes, and earthy aromatic spices.', 1500.00, 'Mains (Vegetarian)', 'https://loremflickr.com/600/400/indian,eggplant/16'),

    -- Mains Non-Vegetarian
    ('Saffron Lobster Malai Curry', 'Whole lobster poached in a delicate gravy of coconut milk, mustard, and saffron.', 5500.00, 'Mains (Non-Vegetarian)', 'https://loremflickr.com/600/400/indian,lobster/17'),
    ('Awadhi Lamb Biryani', 'Premium basmati rice and tender lamb cooked slowly under a pastry seal with aromatic spices.', 3800.00, 'Mains (Non-Vegetarian)', 'https://loremflickr.com/600/400/indian,biryani/18'),
    ('Nalli Nihari', 'Slow-cooked lamb shanks in a rich, spice-infused marrow stew. A regal delicacy.', 4200.00, 'Mains (Non-Vegetarian)', 'https://loremflickr.com/600/400/indian,mutton,curry/19'),
    ('Classic Butter Chicken', 'Tandoori-roasted chicken simmered in a velvet-smooth smoked tomato and fenugreek gravy.', 2800.00, 'Mains (Non-Vegetarian)', 'https://loremflickr.com/600/400/indian,butter-chicken/20'),
    ('Laal Maas', 'A fiery, vibrant red mutton curry from Rajasthan utilizing Mathania chilies.', 3400.00, 'Mains (Non-Vegetarian)', 'https://loremflickr.com/600/400/indian,meat,curry/21'),
    ('Goan Fish Curry', 'Fresh Catch of the day simmered in a tangy coconut, kokum, and roasted red chili gravy.', 3100.00, 'Mains (Non-Vegetarian)', 'https://loremflickr.com/600/400/indian,fish-curry/22'),
    ('Murg Tikka Masala', 'Charcoal grilled chicken tikka tossed in an onion-tomato masala base.', 2700.00, 'Mains (Non-Vegetarian)', 'https://loremflickr.com/600/400/indian,tikka-masala/23'),
    ('Raan-E-Sikandari', 'Whole leg of lamb marinated in a secret blend of spices and roasted for 12 hours.', 6800.00, 'Mains (Non-Vegetarian)', 'https://loremflickr.com/600/400/indian,lamb/24'),

    -- Breads & Sides
    ('Truffle Cheese Naan', 'Tandoor-baked flatbread stuffed with vintage cheddar and finished with truffle oil.', 800.00, 'Breads & Sides', 'https://loremflickr.com/600/400/indian,naan,cheese/25'),
    ('Garlic Butter Naan', 'Classic flatbread brushed liberally with garlic and organic cow ghee.', 500.00, 'Breads & Sides', 'https://loremflickr.com/600/400/indian,naan,garlic/26'),
    ('Mint Paratha', 'Whole wheat, multi-layered flaky bread brushed with dried mint flakes.', 450.00, 'Breads & Sides', 'https://loremflickr.com/600/400/indian,paratha/27'),
    ('Burrani Raita', 'Thick chilled yogurt whisked with roasted garlic and cumin.', 400.00, 'Breads & Sides', 'https://loremflickr.com/600/400/indian,raita/28'),

    -- Desserts
    ('24K Pistachio Rasmalai', 'Soft cheese discs immersed in thickened pistachio milk, adorned with real 24-karat gold leaf.', 1200.00, 'Desserts', 'https://loremflickr.com/600/400/indian,rasmalai/29'),
    ('Rose Petal Gulab Jamun', 'Warm reduced-milk dumplings soaked in a rose-infused sugar syrup.', 950.00, 'Desserts', 'https://loremflickr.com/600/400/indian,gulabjamun/30'),
    ('Shahi Tukda', 'Crisp fried bread soaked in saffron milk and topped with rich clotted cream.', 1100.00, 'Desserts', 'https://loremflickr.com/600/400/indian,dessert,sweet/31'),
    ('Filter Coffee Ice Cream', 'Artisanal ice cream infused with rich South Indian filter coffee decoction.', 850.00, 'Desserts', 'https://loremflickr.com/600/400/indian,ice-cream/32'),

    -- Beverages
    ('Saffron Cardamom Lassi', 'A thick churned yogurt drink sweetened and infused with premium saffron.', 600.00, 'Beverages', 'https://loremflickr.com/600/400/indian,lassi/33'),
    ('Chai Royal', 'A bespoke blend of Assam tea, brewed slowly with spices and milk.', 500.00, 'Beverages', 'https://loremflickr.com/600/400/indian,chai,tea/34'),
    ('Mango Mint Mojito', 'Fresh local Alphonso mango puree muddled with mint and sparkling water.', 700.00, 'Beverages', 'https://loremflickr.com/600/400/indian,mojito,mango/35'),
    ('Jal Jeera', 'A refreshing, tangy mocktail flavored with roasted cumin and tamarind.', 500.00, 'Beverages', 'https://loremflickr.com/600/400/indian,drink,spiced/36')
  `;

  try {
    console.log('Building schema & resetting for Indian Theme Shift...');
    
    await db.query(`DROP TABLE IF EXISTS bookings CASCADE`);
    await db.query(`DROP TABLE IF EXISTS rooms CASCADE`);
    await db.query(`DROP TABLE IF EXISTS menu_items CASCADE`);
    await db.query(`DROP TABLE IF EXISTS users CASCADE`);

    await db.query(usersTable);
    await db.query(roomsTable);
    await db.query(menusTable);
    await db.query(bookingsTable);
    
    console.log('Seeding initial Indian Data...');
    await db.query(seedRooms);
    await db.query(seedMenu);
    
    console.log('Database Indian Overhaul completed.');
  } catch (error) {
    console.error('Error modifying tables:', error);
  } finally {
    process.exit();
  }
}

createTables();
