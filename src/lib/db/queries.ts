import { createClient } from '@/lib/supabase/server';
import {
  NewsArticle,
  Announcement,
  GalleryItem,
  Meeting,
  SupportedLocale,
} from '@/types/database';

/**
 * Fetch published news articles for the given locale with English fallback
 */
export async function getPublishedNews(
  locale: SupportedLocale = 'en',
  limit: number = 6,
  category?: string
): Promise<NewsArticle[]> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from('news')
      .select(`
        id,
        slug,
        category,
        featured_image,
        images,
        status,
        is_featured,
        is_pinned,
        author_name,
        published_at,
        created_at,
        updated_at,
        translations:news_translations (
          id,
          locale,
          title,
          excerpt,
          body,
          seo_title,
          seo_description
        )
      `)
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      .order('is_pinned', { ascending: false })
      .order('published_at', { ascending: false })
      .limit(limit);

    if (category && category !== 'All' && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return getFallbackNews(locale);
    }

    return data.map((item) => {
      const transList = item.translations || [];
      // Prefer current locale, fall back to English, then first available
      const trans =
        transList.find((t: { locale: string }) => t.locale === locale) ||
        transList.find((t: { locale: string }) => t.locale === 'en') ||
        transList[0];

      return {
        ...item,
        title: trans?.title || 'Untitled Article',
        excerpt: trans?.excerpt || '',
        body: trans?.body || '',
      };
    });
  } catch (err) {
    console.warn('Supabase query error for news, using fallback data:', err);
    return getFallbackNews(locale);
  }
}

/**
 * Fetch single news article by slug
 */
export async function getNewsArticleBySlug(
  slug: string,
  locale: SupportedLocale = 'en'
): Promise<NewsArticle | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('news')
      .select(`
        id,
        slug,
        category,
        featured_image,
        images,
        status,
        is_featured,
        is_pinned,
        author_name,
        published_at,
        created_at,
        updated_at,
        translations:news_translations (
          id,
          locale,
          title,
          excerpt,
          body,
          seo_title,
          seo_description
        )
      `)
      .eq('slug', slug)
      .single();

    if (error || !data) {
      const fallback = getFallbackNews(locale).find((n) => n.slug === slug);
      return fallback || null;
    }

    const transList = data.translations || [];
    const trans =
      transList.find((t: { locale: string }) => t.locale === locale) ||
      transList.find((t: { locale: string }) => t.locale === 'en') ||
      transList[0];

    return {
      ...data,
      title: trans?.title || 'Untitled Article',
      excerpt: trans?.excerpt || '',
      body: trans?.body || '',
    };
  } catch {
    const fallback = getFallbackNews(locale).find((n) => n.slug === slug);
    return fallback || null;
  }
}

/**
 * Fetch active public announcements
 */
export async function getActiveAnnouncements(
  locale: SupportedLocale = 'en',
  limit: number = 5
): Promise<Announcement[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('announcements')
      .select(`
        id,
        priority,
        status,
        is_pinned,
        attachment_url,
        attachment_name,
        published_at,
        expires_at,
        created_at,
        updated_at,
        translations:announcement_translations (
          id,
          locale,
          title,
          body
        )
      `)
      .eq('status', 'published')
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
      .order('is_pinned', { ascending: false })
      .order('priority', { ascending: false }) // 'urgent' before 'normal'
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return getFallbackAnnouncements(locale);
    }

    return data.map((item) => {
      const transList = item.translations || [];
      const trans =
        transList.find((t: { locale: string }) => t.locale === locale) ||
        transList.find((t: { locale: string }) => t.locale === 'en') ||
        transList[0];

      return {
        ...item,
        title: trans?.title || 'Notice',
        body: trans?.body || '',
      };
    });
  } catch {
    return getFallbackAnnouncements(locale);
  }
}

/**
 * Fetch published photo gallery items
 */
export async function getPublishedGalleryItems(
  locale: SupportedLocale = 'en',
  limit: number = 8
): Promise<GalleryItem[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('gallery_items')
      .select(`
        id,
        image_url,
        category,
        sort_order,
        is_published,
        created_at,
        updated_at,
        translations:gallery_translations (
          id,
          locale,
          title,
          description,
          alt_text
        )
      `)
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return getFallbackGallery(locale);
    }

    return data.map((item) => {
      const transList = item.translations || [];
      const trans =
        transList.find((t: { locale: string }) => t.locale === locale) ||
        transList.find((t: { locale: string }) => t.locale === 'en') ||
        transList[0];

      return {
        ...item,
        title: trans?.title || 'Gallery Photograph',
        description: trans?.description || '',
        alt_text: trans?.alt_text || 'Shenen Kolu Photograph',
      };
    });
  } catch {
    return getFallbackGallery(locale);
  }
}

/**
 * Fetch scheduled public meetings
 */
export async function getScheduledMeetings(
  locale: SupportedLocale = 'en',
  limit: number = 4
): Promise<Meeting[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('meetings')
      .select(`
        id,
        room_id,
        host_name,
        scheduled_start,
        duration_minutes,
        access_policy,
        status,
        max_participants,
        created_at,
        updated_at,
        translations:meeting_translations (
          id,
          locale,
          title,
          description
        )
      `)
      .in('status', ['scheduled', 'active'])
      .order('scheduled_start', { ascending: true })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return getFallbackMeetings(locale);
    }

    return data.map((item) => {
      const transList = item.translations || [];
      const trans =
        transList.find((t: { locale: string }) => t.locale === locale) ||
        transList.find((t: { locale: string }) => t.locale === 'en') ||
        transList[0];

      return {
        ...item,
        title: trans?.title || 'Scheduled Meeting',
        description: trans?.description || '',
      };
    });
  } catch {
    return getFallbackMeetings(locale);
  }
}

// -----------------------------------------------------------------------------
// Offline / Initial Fallback Data
// -----------------------------------------------------------------------------
function getFallbackNews(locale: SupportedLocale): NewsArticle[] {
  const isOm = locale === 'om';
  const isAm = locale === 'am';

  return [
    {
      id: '11111111-1111-1111-1111-111111111111',
      slug: 'woreda-irrigation-expansion-initiative-launched',
      category: 'Agriculture & Rural Development',
      featured_image:
        'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=1200&q=80',
      status: 'published',
      is_featured: true,
      is_pinned: true,
      author_name: 'Agricultural Development Bureau',
      published_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      title: isOm
        ? 'Biiroon Qonnaa Aanaa Babal\'ina Misooma Jallisii Aduu Gandaalee 12f Eegalchiise'
        : isAm
        ? 'የወረዳው ግብርና ቢሮ በ12 ቀበሌዎች የፀሐይ ኃይል መስኖ ማስፋፊያ ስራ ጀመረ'
        : 'Woreda Agricultural Bureau Launches Solar Irrigation Expansion for 12 Kebeles',
      excerpt: isOm
        ? 'Tattaaffiin ammayyeessuu misooma jallisii hawaasaa gandaalee baadiyyaa keessatti oomisha waggaa guutuu deeggaruuf eegalameera.'
        : isAm
        ? 'በገጠር ቀበሌዎች ዓመቱን ሙሉ የመኸር ምርትን ለመደገፍ የማህበረሰብ አቀፍ የመስኖ ዘመናዊነት ስራ ተጀምሯል።'
        : 'A community-driven irrigation modernization initiative has commenced across rural kebeles to support year-round harvest.',
      body: isOm
        ? 'Waajjirri Misooma Qonnaa Aanaa Shenen Koolu pirojektii babal\'ina jallisii hawaasaa kan paampii aduutiin hojjetu gandaalee xiyyeeffannoo 12 keessatti jalqabsiiseera. Tattaaffiin tarsiimoo kun oomisha qonnaan bultootaa dachaan guddisuu, bona dandamachuu fi waldaalee qonnaatiif walitti hidhamiinsa gabaa amansiisaa uumuuf qophaa\'eera.'
        : isAm
        ? 'የሸነን ኮሉ ወረዳ የግብርና ልማት ጽህፈት ቤት በ12 ሞዴል ቀበሌዎች በፀሐይ ኃይል የሚሰሩ የውሃ መሳቢያ ፓምፖችን በመጠቀም የተቀናጀ የመስኖ ማስፋፊያ ፕሮጀክት ጀምሯል። ይህ ስትራቴጂካዊ ተነሳሽነት የአርሶ አደሩን ምርታማነት በእጥፍ ለማሳደግ፣ ድርቅን ለመቋቋም እና ለግብርና ህብረት ስራ ማህበራት አስተማማኝ የገበያ ትስስር ለመፍጠር ያለመ ነው።'
        : 'The Shenen Kolu Woreda Agricultural Development Bureau has initiated an expanded community irrigation project designed to harness solar-powered pumping systems across 12 target kebeles. This strategic initiative aims to double crop yields, mitigate dry-season vulnerabilities, and provide structured market linkages for regional farming cooperatives.',
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      slug: 'clean-water-sanitation-facilities-completed',
      category: 'Infrastructure & Water',
      featured_image:
        'https://images.unsplash.com/photo-1541888946425-d0fbb186241f?auto=format&fit=crop&w=1200&q=80',
      status: 'published',
      is_featured: false,
      is_pinned: false,
      author_name: 'Water Resources Administration',
      published_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      title: isOm
        ? 'Buufataaleen Bishaanii Qulqulluu Lammiilee 18,000 Ol Tajaajilan Xumuraman'
        : isAm
        ? 'ከ18,000 በላይ ነዋሪዎችን ተጠቃሚ የሚያደርጉ ዘመናዊ የመጠጥ ውሃ ማዕከላት ተመረቁ'
        : 'Completion of Modern Potable Water Stations Serving Over 18,000 Residents',
      excerpt: isOm
        ? 'Bishaan lafa jalaa gadi fagoo fi buufataaleen raabsaa bishaanii afur Shenen Koolu keessatti eebbifamaniiru.'
        : isAm
        ? 'አራት ጥልቅ የከርሰ ምድር የውሃ ጉድጓዶች እና የውሃ ማከፋፈያ ጣቢያዎች በይፋ ስራ ጀመሩ።'
        : 'Four deep groundwater wells and distribution kiosks have been officially inaugurated in Shenen Kolu.',
      body: isOm
        ? 'Ummanni bishaan qulqulluu argachuu irratti tarkaanfiin guddaan fudhatameera. Kuusaa bishaanii fi buufanni raabsaa afur eebbifamuun dubartootaa fi daa\'imman bishaan fagootti deemsisuu hambisee qulqullina naannoo eeguuf gumaacha olaanaa qaba.'
        : isAm
        ? 'በሸነን ኮሉ ወረዳ የህዝብ ንጹህ የመጠጥ ውሃ አቅርቦትን ለማረጋገጥ የተከናወኑ አራት ዘመናዊ የውሃ ማከማቻ ገንዳዎች እና የማከፋፈያ መስመሮች ተመርቀው ለአገልግሎት በቅተዋል። ፕሮጀክቱ ሴቶችና ህፃናት ውሃ ፍለጋ የሚጓዙትን ርቀት በእጅጉ የሚያቃልልና የህብረተሰቡን ጤና የሚጠብቅ ነው።'
        : 'Public access to verified safe potable water reached a major milestone this week with the commissioning of four advanced water reservoirs and distribution points. The project significantly reduces travel distances for women and children while enhancing public hygiene and disease prevention.',
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      slug: 'youth-vocational-skills-training-graduation',
      category: 'Education & Youth Empowerment',
      featured_image:
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      status: 'published',
      is_featured: false,
      is_pinned: false,
      author_name: 'Youth and Sports Directorate',
      published_at: new Date(Date.now() - 8 * 86400000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      title: isOm
        ? 'Dargaggoonni 350 Leenjii Ogummaa fi Daldalaa Irraa Eebbifaman'
        : isAm
        ? '350 የአካባቢው ወጣቶች በሙያ እና ስራ ፈጠራ ስልጠና ተመርቀዋል'
        : '350 Local Youth Graduate from Vocational Skills and Entrepreneurship Program',
      excerpt: isOm
        ? 'Eebbifamtoonni leenjii ijaarsaa, qonnaa fi toora maallaqaa dijitaalaa fudhataniiru.'
        : isAm
        ? 'ተመራቂዎቹ በኮንስትራክሽን፣ በግብርና ንግድ እና በዲጂታል ፋይናንስ አስተዳደር ተግባራዊ ስልጠና ወስደዋል።'
        : 'Graduates received certified technical training in masonry, agribusiness, and digital financial management.',
      body: isOm
        ? 'Koleejota teeknikaa waliin ta\'uun, Aanaan Shenen Koolu dargaggoota 350 leenjii qabatamaa xumuran eebbisiiseera. Waldaalee dargaggootaaf meeshaaleen hojii eegalchiisu badhaafameera.'
        : isAm
        ? 'ከቴክኒክና ሙያ ኮሌጆች ጋር በመተባበር የሸነን ኮሉ ወረዳ አጠቃላይ ተግባራዊ ስልጠና የወሰዱ 350 ወጣቶችን አስመርቋል። ለተደራጁ የወጣቶች ማህበራት የመነሻ የስራ መስሪያ መሳሪያዎች ድጋፍ ተደርጓል።'
        : 'In partnership with regional technical colleges, Shenen Kolu celebrated the graduation of 350 youth who completed comprehensive practical courses. Micro-grant start-up toolkits were awarded to the top cooperative ventures.',
    },
  ];
}

function getFallbackAnnouncements(locale: SupportedLocale): Announcement[] {
  const isOm = locale === 'om';
  const isAm = locale === 'am';

  return [
    {
      id: '44444444-4444-4444-4444-444444444444',
      priority: 'urgent',
      status: 'published',
      is_pinned: true,
      published_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 14 * 86400000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      title: isOm
        ? 'Hubachiisa Ariifachiisaa: Duulli Talaallii Daa\'immanii Wiixata Eegala'
        : isAm
        ? 'አስቸኳይ ማስታወቂያ፡ አጠቃላይ የህፃናት ክትባት ዘመቻ ከሰኞ ጀምሮ ይካሄዳል'
        : 'Urgent Notice: Comprehensive Childhood Vaccination Campaign Begins Monday',
      body: isOm
        ? 'Maatii fi guddiftuu hundi buufata fayyaa naannoo isaanii deemuun daa\'imman isaaniif talaallii akka kennisiisan gaafatamu.'
        : isAm
        ? 'በሁሉም ቀበሌዎች የሚገኙ ወላጆች እና አሳዳጊዎች ህፃናትን በአቅራቢያቸው ወደሚገኙ ጤና ኬላዎች በመውሰድ መደበኛና ተጨማሪ ክትባቶችን እንዲያስከትቡ በጥብቅ ይሳሰባል።'
        : 'All parents and guardians across all kebeles are urged to visit their local primary health posts for routine and supplemental immunization.',
    },
    {
      id: '55555555-5555-5555-5555-555555555555',
      priority: 'normal',
      status: 'published',
      is_pinned: false,
      published_at: new Date(Date.now() - 86400000).toISOString(),
      expires_at: new Date(Date.now() + 20 * 86400000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      title: isOm
        ? 'Beeksisa Yaa\'ii Hawaasaa Dhimmoota Misooma Gandaa Irratti'
        : isAm
        ? 'የቀበሌ የልማት ቅድሚያ ተግባራትን የሚመለከት የህዝብ ውይይት ማስታወቂያ'
        : 'Notice of Public Community Assembly for Kebele Development Priorities',
      body: isOm
        ? 'Lammiileen marii waggaatti yeroo lama geggeeffamu irratti hirmaachuun karoora bu\'uura misoomaa fi baajata gandaa akka gamaaggaman affeeramaniiru.'
        : isAm
        ? 'የመሠረተ ልማት እቅዶችን እና የቀበሌ በጀቶችን ለመገምገም በሚካሄደው ግማሽ ዓመታዊ የማህበረሰብ ውይይት ላይ ነዋሪዎች እንዲሳተፉ ጥሪ ቀርቧል።'
        : 'Citizens are invited to attend the bi-annual consultation meeting to evaluate infrastructure roadmaps and kebele budgets.',
    },
  ];
}

function getFallbackGallery(locale: SupportedLocale): GalleryItem[] {
  const isOm = locale === 'om';
  const isAm = locale === 'am';

  return [
    {
      id: '66666666-6666-6666-6666-666666666666',
      image_url:
        'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80',
      category: 'Community Action',
      sort_order: 1,
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      title: isOm
        ? 'Marii Hawaasaa Wiirtuu Shenen Koolutti Geggeeffame'
        : isAm
        ? 'በሸነን ኮሉ ማዕከል የተካሄደ የማህበረሰብ ውይይት መድረክ'
        : 'Community Consultation Meeting at Shenen Kolu Center',
      description: isOm
        ? 'Ummanni karoora misoomaa irratti murteessuuf walitti qabame.'
        : isAm
        ? 'ነዋሪዎች በልማት እቅዶች ላይ ውሳኔ ለማሳለፍ ተሰብስበው ውይይት ሲያደርጉ።'
        : 'Residents gathered for participatory decision making and project prioritization.',
      alt_text: 'Community assembly in Shenen Kolu',
    },
    {
      id: '77777777-7777-7777-7777-777777777777',
      image_url:
        'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
      category: 'Agriculture',
      sort_order: 2,
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      title: isOm
        ? 'Dirree Misooma Qamadii Kilaastaraa'
        : isAm
        ? 'የኩታ ገጠም የስንዴ ልማት ማሳ ቅኝት'
        : 'Wheat Cluster Farming Demonstration Field',
      description: isOm
        ? 'Oomisha qamadii bu\'a qabeessa gandaalee qonnaa keessatti.'
        : isAm
        ? 'በምስራቃዊ የግብርና ቀበሌዎች የተከናወነ የተሳካ የሜካናይዝድ ምርት ማሳያ።'
        : 'High-yield mechanized harvesting trial in eastern agricultural kebeles.',
      alt_text: 'Golden wheat harvest field',
    },
  ];
}

function getFallbackMeetings(locale: SupportedLocale): Meeting[] {
  const isOm = locale === 'om';
  const isAm = locale === 'am';

  return [
    {
      id: '88888888-8888-8888-8888-888888888888',
      room_id: 'shenen-kolu-townhall-live',
      host_name: 'Woreda Communications Secretariat',
      scheduled_start: new Date(Date.now() + 86400000).toISOString(),
      duration_minutes: 90,
      access_policy: 'public',
      status: 'scheduled',
      max_participants: 50,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      title: isOm
        ? 'Walga\'ii Ummataa Aanaa: Karoora Qonnaa fi Deeggarsa Bonaa'
        : isAm
        ? 'የወረዳው ህዝባዊ መድረክ፡ የግብርና እቅድ እና የበጋ መስኖ ድጋፍ'
        : 'Woreda Town Hall: Agricultural Roadmap & Dry Season Support',
      description: isOm
        ? 'Marii uummataaf banaa ta\'e kan hooggantoota aanaa waliin raabsa xaa\'oo irratti mari\'atamu.'
        : isAm
        ? 'ከወረዳው አመራሮች ጋር የማዳበሪያ አቅርቦት እና የአርሶ አደር ድጋፍን የሚመለከት ግልጽ ውይይት።'
        : 'Open public session with woreda leadership discussing fertilizer distribution and farmer support.',
    },
  ];
}
