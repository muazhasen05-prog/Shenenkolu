-- =============================================================================
-- Development & Test Multilingual Seed Data
-- CAUTION: FOR LOCAL DEVELOPMENT AND TESTING ONLY. DO NOT RUN IN PRODUCTION.
-- =============================================================================

-- 1. Initial Site Settings
INSERT INTO public.site_settings (key, value)
VALUES
  (
    'general',
    '{
      "siteName": "Shenen Kolu Woreda Prosperity Party",
      "slogan": "Serving our community with dedication, unity, and progress",
      "contactEmail": "info@shenenkolu.gov.et",
      "contactPhone": "+251 11 000 0000",
      "address": "Shenen Kolu Woreda Administration Complex, Oromia, Ethiopia",
      "defaultLocale": "en"
    }'::jsonb
  )
ON CONFLICT (key) DO NOTHING;

-- 2. Sample News Articles
DO $$
DECLARE
  news1_id UUID := '11111111-1111-1111-1111-111111111111';
  news2_id UUID := '22222222-2222-2222-2222-222222222222';
  news3_id UUID := '33333333-3333-3333-3333-333333333333';
  ann1_id UUID := '44444444-4444-4444-4444-444444444444';
  ann2_id UUID := '55555555-5555-5555-5555-555555555555';
  gal1_id UUID := '66666666-6666-6666-6666-666666666666';
  gal2_id UUID := '77777777-7777-7777-7777-777777777777';
  meet1_id UUID := '88888888-8888-8888-8888-888888888888';
BEGIN

  -- News 1: Irrigation & Agricultural Modernization
  INSERT INTO public.news (id, slug, category, featured_image, status, is_featured, is_pinned, author_name, published_at)
  VALUES (
    news1_id,
    'woreda-irrigation-expansion-initiative-launched',
    'Agriculture & Rural Development',
    'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=1200&q=80',
    'published',
    true,
    true,
    'Agricultural Development Bureau',
    timezone('utc'::text, now() - INTERVAL '2 days')
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.news_translations (news_id, locale, title, excerpt, body)
  VALUES
    (
      news1_id,
      'en',
      'Woreda Agricultural Bureau Launches Solar Irrigation Expansion for 12 Kebeles',
      'A community-driven irrigation modernization initiative has commenced across rural kebeles to support year-round harvest.',
      'The Shenen Kolu Woreda Agricultural Development Bureau has initiated an expanded community irrigation project designed to harness solar-powered pumping systems across 12 target kebeles. This strategic initiative aims to double crop yields, mitigate dry-season vulnerabilities, and provide structured market linkages for regional farming cooperatives.'
    ),
    (
      news1_id,
      'om',
      'Biiroon Qonnaa Aanaa Babal''ina Misooma Jallisii Aduu Gandaalee 12f Eegalchiise',
      'Tattaaffiin ammayyeessuu misooma jallisii hawaasaa gandaalee baadiyyaa keessatti oomisha waggaa guutuu deeggaruuf eegalameera.',
      'Waajjirri Misooma Qonnaa Aanaa Shenen Koolu pirojektii babal''ina jallisii hawaasaa kan paampii aduutiin hojjetu gandaalee xiyyeeffannoo 12 keessatti jalqabsiiseera. Tattaaffiin tarsiimoo kun oomisha qonnaan bultootaa dachaan guddisuu, bona dandamachuu fi waldaalee qonnaatiif walitti hidhamiinsa gabaa amansiisaa uumuuf qophaa''eera.'
    ),
    (
      news1_id,
      'am',
      'የወረዳው ግብርና ቢሮ በ12 ቀበሌዎች የፀሐይ ኃይል መስኖ ማስፋፊያ ስራ ጀመረ',
      'በገጠር ቀበሌዎች ዓመቱን ሙሉ የመኸር ምርትን ለመደገፍ የማህበረሰብ አቀፍ የመስኖ ዘመናዊነት ስራ ተጀምሯል።',
      'የሸነን ኮሉ ወረዳ የግብርና ልማት ጽህፈት ቤት በ12 ሞዴል ቀበሌዎች በፀሐይ ኃይል የሚሰሩ የውሃ መሳቢያ ፓምፖችን በመጠቀም የተቀናጀ የመስኖ ማስፋፊያ ፕሮጀክት ጀምሯል። ይህ ስትራቴጂካዊ ተነሳሽነት የአርሶ አደሩን ምርታማነት በእጥፍ ለማሳደግ፣ ድርቅን ለመቋቋም እና ለግብርና ህብረት ስራ ማህበራት አስተማማኝ የገበያ ትስስር ለመፍጠር ያለመ ነው።'
    )
  ON CONFLICT (news_id, locale) DO NOTHING;

  -- News 2: Clean Water Infrastructure
  INSERT INTO public.news (id, slug, category, featured_image, status, is_featured, is_pinned, author_name, published_at)
  VALUES (
    news2_id,
    'clean-water-sanitation-facilities-completed',
    'Infrastructure & Water',
    'https://images.unsplash.com/photo-1541888946425-d0fbb186241f?auto=format&fit=crop&w=1200&q=80',
    'published',
    false,
    false,
    'Water Resources Administration',
    timezone('utc'::text, now() - INTERVAL '5 days')
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.news_translations (news_id, locale, title, excerpt, body)
  VALUES
    (
      news2_id,
      'en',
      'Completion of Modern Potable Water Stations Serving Over 18,000 Residents',
      'Four deep groundwater wells and distribution kiosks have been officially inaugurated in Shenen Kolu.',
      'Public access to verified safe potable water reached a major milestone this week with the commissioning of four advanced water reservoirs and distribution points. The project significantly reduces travel distances for women and children while enhancing public hygiene and disease prevention.'
    ),
    (
      news2_id,
      'om',
      'Buufataaleen Bishaanii Qulqulluu Lammiilee 18,000 Ol Tajaajilan Xumuraman',
      'Bishaan lafa jalaa gadi fagoo fi buufataaleen raabsaa bishaanii afur Shenen Koolu keessatti eebbifamaniiru.',
      'Ummanni bishaan qulqulluu argachuu irratti tarkaanfiin guddaan fudhatameera. Kuusaa bishaanii fi buufanni raabsaa afur eebbifamuun dubartootaa fi daa''imman bishaan fagootti deemsisuu hambisee qulqullina naannoo eeguuf gumaacha olaanaa qaba.'
    ),
    (
      news2_id,
      'am',
      'ከ18,000 በላይ ነዋሪዎችን ተጠቃሚ የሚያደርጉ ዘመናዊ የመጠጥ ውሃ ማዕከላት ተመረቁ',
      'አራት ጥልቅ የከርሰ ምድር የውሃ ጉድጓዶች እና የውሃ ማከፋፈያ ጣቢያዎች በይፋ ስራ ጀመሩ።',
      'በሸነን ኮሉ ወረዳ የህዝብ ንጹህ የመጠጥ ውሃ አቅርቦትን ለማረጋገጥ የተከናወኑ አራት ዘመናዊ የውሃ ማከማቻ ገንዳዎች እና የማከፋፈያ መስመሮች ተመርቀው ለአገልግሎት በቅተዋል። ፕሮጀክቱ ሴቶችና ህፃናት ውሃ ፍለጋ የሚጓዙትን ርቀት በእጅጉ የሚያቃልልና የህብረተሰቡን ጤና የሚጠብቅ ነው።'
    )
  ON CONFLICT (news_id, locale) DO NOTHING;

  -- News 3: Youth Empowerment & Technical Vocational Training
  INSERT INTO public.news (id, slug, category, featured_image, status, is_featured, is_pinned, author_name, published_at)
  VALUES (
    news3_id,
    'youth-vocational-skills-training-graduation',
    'Education & Youth Empowerment',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    'published',
    false,
    false,
    'Youth and Sports Directorate',
    timezone('utc'::text, now() - INTERVAL '8 days')
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.news_translations (news_id, locale, title, excerpt, body)
  VALUES
    (
      news3_id,
      'en',
      '350 Local Youth Graduate from Vocational Skills and Entrepreneurship Program',
      'Graduates received certified technical training in masonry, agribusiness, and digital financial management.',
      'In partnership with regional technical colleges, Shenen Kolu celebrated the graduation of 350 youth who completed comprehensive practical courses. Micro-grant start-up toolkits were awarded to the top cooperative ventures.'
    ),
    (
      news3_id,
      'om',
      'Dargaggoonni 350 Leenjii Ogummaa fi Daldalaa Irraa Eebbifaman',
      'Eebbifamtoonni leenjii ijaarsaa, qonnaa fi toora maallaqaa dijitaalaa fudhataniiru.',
      'Koleejota teeknikaa waliin ta''uun, Aanaan Shenen Koolu dargaggoota 350 leenjii qabatamaa xumuran eebbisiiseera. Waldaalee dargaggootaaf meeshaaleen hojii eegalchiisu badhaafameera.'
    ),
    (
      news3_id,
      'am',
      '350 የአካባቢው ወጣቶች በሙያ እና ስራ ፈጠራ ስልጠና ተመርቀዋል',
      'ተመራቂዎቹ በኮንስትራክሽን፣ በግብርና ንግድ እና በዲጂታል ፋይናንስ አስተዳደር ተግባራዊ ስልጠና ወስደዋል።',
      'ከቴክኒክና ሙያ ኮሌጆች ጋር በመተባበር የሸነን ኮሉ ወረዳ አጠቃላይ ተግባራዊ ስልጠና የወሰዱ 350 ወጣቶችን አስመርቋል። ለተደራጁ የወጣቶች ማህበራት የመነሻ የስራ መስሪያ መሳሪያዎች ድጋፍ ተደርጓል።'
    )
  ON CONFLICT (news_id, locale) DO NOTHING;

  -- Announcements
  -- Announcement 1 (Urgent): Vaccination & Health Drive
  INSERT INTO public.announcements (id, priority, status, is_pinned, published_at, expires_at)
  VALUES (
    ann1_id,
    'urgent',
    'published',
    true,
    timezone('utc'::text, now()),
    timezone('utc'::text, now() + INTERVAL '14 days')
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.announcement_translations (announcement_id, locale, title, body)
  VALUES
    (
      ann1_id,
      'en',
      'Urgent Notice: Comprehensive Childhood Vaccination Campaign Begins Monday',
      'All parents and guardians across all kebeles are urged to visit their local primary health posts for routine and supplemental immunization.'
    ),
    (
      ann1_id,
      'om',
      'Hubachiisa Ariifachiisaa: Duulli Talaallii Daa''immanii Wiixata Eegala',
      'Maatii fi guddiftuu hundi buufata fayyaa naannoo isaanii deemuun daa''imman isaaniif talaallii akka kennisiisan gaafatamu.'
    ),
    (
      ann1_id,
      'am',
      'አስቸኳይ ማስታወቂያ፡ አጠቃላይ የህፃናት ክትባት ዘመቻ ከሰኞ ጀምሮ ይካሄዳል',
      'በሁሉም ቀበሌዎች የሚገኙ ወላጆች እና አሳዳጊዎች ህፃናትን በአቅራቢያቸው ወደሚገኙ ጤና ኬላዎች በመውሰድ መደበኛና ተጨማሪ ክትባቶችን እንዲያስከትቡ በጥብቅ ይሳሰባል።'
    )
  ON CONFLICT (announcement_id, locale) DO NOTHING;

  -- Announcement 2 (Normal): Public Kebele Assembly Consultation
  INSERT INTO public.announcements (id, priority, status, is_pinned, published_at, expires_at)
  VALUES (
    ann2_id,
    'normal',
    'published',
    false,
    timezone('utc'::text, now() - INTERVAL '1 day'),
    timezone('utc'::text, now() + INTERVAL '20 days')
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.announcement_translations (announcement_id, locale, title, body)
  VALUES
    (
      ann2_id,
      'en',
      'Notice of Public Community Assembly for Kebele Development Priorities',
      'Citizens are invited to attend the bi-annual consultation meeting to evaluate infrastructure roadmaps and kebele budgets.'
    ),
    (
      ann2_id,
      'om',
      'Beeksisa Yaa''ii Hawaasaa Dhimmoota Misooma Gandaa Irratti',
      'Lammiileen marii waggaatti yeroo lama geggeeffamu irratti hirmaachuun karoora bu''uura misoomaa fi baajata gandaa akka gamaaggaman affeeramaniiru.'
    ),
    (
      ann2_id,
      'am',
      'የቀበሌ የልማት ቅድሚያ ተግባራትን የሚመለከት የህዝብ ውይይት ማስታወቂያ',
      'የመሠረተ ልማት እቅዶችን እና የቀበሌ በጀቶችን ለመገምገም በሚካሄደው ግማሽ ዓመታዊ የማህበረሰብ ውይይት ላይ ነዋሪዎች እንዲሳተፉ ጥሪ ቀርቧል።'
    )
  ON CONFLICT (announcement_id, locale) DO NOTHING;

  -- Gallery Items
  INSERT INTO public.gallery_items (id, image_url, category, sort_order, is_published)
  VALUES
    (
      gal1_id,
      'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80',
      'Community Action',
      1,
      true
    ),
    (
      gal2_id,
      'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
      'Agriculture',
      2,
      true
    )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.gallery_translations (gallery_item_id, locale, title, description, alt_text)
  VALUES
    (
      gal1_id,
      'en',
      'Community Consultation Meeting at Shenen Kolu Center',
      'Residents gathered for participatory decision making and project prioritization.',
      'Community elders and woreda administrators in discussion'
    ),
    (
      gal1_id,
      'om',
      'Marii Hawaasaa Wiirtuu Shenen Koolutti Geggeeffame',
      'Ummanni karoora misoomaa irratti murteessuuf walitti qabame.',
      'Jaarsoliin hawaasaa fi bulchiinsi aanaa yeroo marii'
    ),
    (
      gal1_id,
      'am',
      'በሸነን ኮሉ ማዕከል የተካሄደ የማህበረሰብ ውይይት መድረክ',
      'ነዋሪዎች በልማት እቅዶች ላይ ውሳኔ ለማሳለፍ ተሰብስበው ውይይት ሲያደርጉ።',
      'የአገር ሽማግሌዎችና የወረዳ አስተዳዳሪዎች በውይይት ላይ'
    ),
    (
      gal2_id,
      'en',
      'Wheat Cluster Farming Demonstration Field',
      'High-yield mechanized harvesting trial in eastern agricultural kebeles.',
      'Field of golden wheat ready for harvesting in Shenen Kolu'
    ),
    (
      gal2_id,
      'om',
      'Dirree Misooma Qamadii Kilaastaraa',
      'Oomisha qamadii bu''a qabeessa gandaalee qonnaa keessatti.',
      'Misooma qamadii bilchaate kan haamamuuf qophaa''e'
    ),
    (
      gal2_id,
      'am',
      'የኩታ ገጠም የስንዴ ልማት ማሳ ቅኝት',
      'በምስራቃዊ የግብርና ቀበሌዎች የተከናወነ የተሳካ የሜካናይዝድ ምርት ማሳያ።',
      'በሸነን ኮሉ ወረዳ ለመሰብሰብ የደረሰ ለምለም የስንዴ ማሳ'
    )
  ON CONFLICT (gallery_item_id, locale) DO NOTHING;

  -- Meetings
  INSERT INTO public.meetings (id, room_id, host_name, scheduled_start, duration_minutes, access_policy, status, max_participants)
  VALUES (
    meet1_id,
    'shenen-kolu-townhall-live',
    'Woreda Communications Secretariat',
    timezone('utc'::text, now() + INTERVAL '1 day'),
    90,
    'public',
    'scheduled',
    50
  ) ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.meeting_translations (meeting_id, locale, title, description)
  VALUES
    (
      meet1_id,
      'en',
      'Woreda Town Hall: Agricultural Roadmap & Dry Season Support',
      'Open public session with woreda leadership discussing fertilizer distribution and farmer support.'
    ),
    (
      meet1_id,
      'om',
      'Walga''ii Ummataa Aanaa: Karoora Qonnaa fi Deeggarsa Bonaa',
      'Marii uummataaf banaa ta''e kan hooggantoota aanaa waliin raabsa xaa''oo irratti mari''atamu.'
    ),
    (
      meet1_id,
      'am',
      'የወረዳው ህዝባዊ መድረክ፡ የግብርና እቅድ እና የበጋ መስኖ ድጋፍ',
      'ከወረዳው አመራሮች ጋር የማዳበሪያ አቅርቦት እና የአርሶ አደር ድጋፍን የሚመለከት ግልጽ ውይይት።'
    )
  ON CONFLICT (meeting_id, locale) DO NOTHING;

END $$;
