USE matrimonial_db;

INSERT INTO cms_pages (slug, title, content, status)
VALUES
('home-banner', 'Bharat Matrimony', 'Discover graceful, verified profiles in a beautiful matchmaking experience designed for families, meaningful conversations, and confident life decisions.', 'published'),
('about-us', 'About Bharat Matrimony', 'A premium matrimonial platform built for verified, family-friendly, privacy-first matchmaking.', 'published'),
('success-stories', 'Real journeys, meaningful beginnings', 'Mira & Aarav | Ahmedabad to Mumbai | Their families connected through a verified interest and scheduled two family calls before meeting.\nRiya & Karan | Bengaluru | Smart compatibility helped them discover shared values around career, culture, and family life.\nNaina & Dev | Delhi | A premium profile boost helped both families find each other during an active search week.', 'published'),
('blog', 'Matrimony Blog', 'Relationship guidance, wedding planning, profile tips, and family conversation advice.', 'published'),
('faq', 'Frequently Asked Questions', 'Find answers about registration, verification, privacy, subscriptions, and profile safety.', 'published'),
('help-center', 'Help Center', 'Get support for account access, profile updates, reporting, verification, and subscription questions.', 'published'),
('terms-and-conditions', 'Terms and Conditions', 'Use Bharat Matrimony respectfully, honestly, and only for genuine marriage-focused connections.', 'published'),
('privacy-policy', 'Privacy Policy', 'We protect user privacy through profile controls, secure sessions, and careful access to personal details.', 'published'),
('safety-center', 'Verification, moderation, and fraud protection', 'Government ID, PAN, employment, income, selfie, face match, content moderation, scam reporting, and emergency support workflows are represented here.', 'published'),
('seo-pages', 'SEO Pages', 'City, community, religion, and profession landing pages can be managed here for search visibility.', 'draft')
ON DUPLICATE KEY UPDATE title = VALUES(title), content = VALUES(content), status = VALUES(status);
