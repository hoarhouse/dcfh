# DCF Hungary Translation Guide

## Translation Key Structure

This guide documents the translation key mapping between HTML elements and JSON translation files.

## Directory Structure
```
/translations/
├── en.json (source language)
├── it.json (Italian)
├── es.json (Spanish)
├── hu.json (Hungarian)
├── TRANSLATION_GUIDE.md (this file)
└── VERIFICATION_CHECKLIST.md
```

## Translation Key Mapping

### Navigation (`nav.*`)
- `nav.home` → Home navigation link
- `nav.blog` → Blog navigation link
- `nav.about` → About/About Us navigation link
- `nav.initiatives` → Initiatives navigation link
- `nav.contact` → Contact navigation link
- `nav.donate` → Donate navigation link
- `nav.resources` → Resources navigation link

### Hero Section (`hero.*`)
- `hero.title` → Main hero title
- `hero.subtitle` → Hero subtitle/description
- `hero.read_story` → Read story button
- `hero.donate` → Donate button in hero

### TikTok Cards (`tiktok.*`)
- `tiktok.card1_title` → First card title
- `tiktok.card1_subtitle` → First card subtitle
- `tiktok.card2_title` → Second card title
- `tiktok.card2_subtitle` → Second card subtitle
- `tiktok.card3_title` → Third card title
- `tiktok.card3_subtitle` → Third card subtitle

### News Section (`news.*`)
- `news.section_title` → Section header "DCF News"
- `news.loading` → Loading message
- `news.see_all_news` → See all news link

### Newsletter Section (`newsletter.*`)
- `newsletter.badge` → "FREE" badge
- `newsletter.title` → Newsletter signup title
- `newsletter.description` → Newsletter description
- `newsletter.email_placeholder` → Email input placeholder
- `newsletter.button` → Submit button text

### Change Makers (`changemakers.*`)
- `changemakers.section_title` → Section header
- `changemakers.loading` → Loading message
- `changemakers.see_all` → See all link

### Take Action Section (`takeaction.*`)
- `takeaction.section_title` → Main section title
- `takeaction.live_event` → Live event badge
- `takeaction.month_dec` → Month abbreviation
- `takeaction.townhall_title` → Town hall event title
- `takeaction.townhall_desc` → Town hall description
- `takeaction.event_time` → Event time
- `takeaction.event_location` → Event location
- `takeaction.event_duration` → Event duration
- `takeaction.virtual_rsvp` → Virtual RSVP button
- `takeaction.inperson_rsvp` → In-person RSVP button
- `takeaction.attendees_confirmed` → Attendee count message
- `takeaction.professional_label` → Professional badge
- `takeaction.partnership_title` → Partnership card title
- `takeaction.partnership_desc` → Partnership description
- `takeaction.company_placeholder` → Company name placeholder
- `takeaction.role_placeholder` → Role selection placeholder
- `takeaction.role_executive` → Executive option
- `takeaction.role_manager` → Manager option
- `takeaction.role_hr` → HR option
- `takeaction.role_employee` → Employee option
- `takeaction.volunteer_program` → Volunteer checkbox label
- `takeaction.sponsorship_opportunities` → Sponsorship checkbox
- `takeaction.employee_matching` → Employee matching checkbox
- `takeaction.explore_partnership` → Partnership button
- `takeaction.survey_step` → Survey step indicator
- `takeaction.survey_title` → Survey title
- `takeaction.survey_desc` → Survey description
- `takeaction.survey_question` → Survey question
- `takeaction.policy_change` → Policy option
- `takeaction.direct_aid` → Direct aid option
- `takeaction.education` → Education option
- `takeaction.research` → Research option
- `takeaction.skip` → Skip button
- `takeaction.next_question` → Next button
- `takeaction.responses_collected` → Response count
- `takeaction.testimonial_name` → Testimonial author name
- `takeaction.testimonial_location` → Testimonial location
- `takeaction.testimonial_text` → Testimonial content
- `takeaction.join_changemakers` → Join title
- `takeaction.community_desc` → Community description
- `takeaction.members_count` → Member count
- `takeaction.countries_count` → Countries count
- `takeaction.actions_count` → Actions count
- `takeaction.join_community_placeholder` → Join input placeholder
- `takeaction.join_community` → Join button

### Initiatives Section (`initiatives.*`)
- `initiatives.section_title` → Section header
- `initiatives.badge` → Section badge
- `initiatives.peace_title` → Peace initiative title
- `initiatives.peace_subtitle` → Peace initiative subtitle
- `initiatives.peace_desc` → Peace initiative description
- `initiatives.peace_btn` → Peace initiative button
- `initiatives.health_title` → Health initiative title
- `initiatives.health_subtitle` → Health subtitle
- `initiatives.health_desc` → Health description
- `initiatives.health_btn` → Health button
- `initiatives.research_title` → Research title
- `initiatives.research_subtitle` → Research subtitle
- `initiatives.research_desc` → Research description
- `initiatives.research_btn` → Research button
- `initiatives.education_title` → Education title
- `initiatives.education_subtitle` → Education subtitle
- `initiatives.education_desc` → Education description
- `initiatives.education_btn` → Education button
- `initiatives.see_all` → See all initiatives link

### Events Section (`events.*`)
- `events.section_title` → Section header
- `events.breakthrough_title` → First event title
- `events.breakthrough_desc` → First event description
- `events.days_ago` → Time indicator
- `events.read_more` → Read more link
- `events.summit_title` → Second event title
- `events.summit_desc` → Second event description
- `events.week_ago` → Time indicator
- `events.read_story` → Read story link

### Resources Section (`resources.*`)
- `resources.section_title` → Section header
- `resources.loading` → Loading message
- `resources.see_all` → See all link

### Common Translations (`common.*`)
- `common.see_all` → Generic see all text
- `common.loading` → Generic loading text
- `common.error` → Error message
- `common.try_again` → Try again text

### Image Alt Text (`images.*`)
- `images.vatican_summit` → Vatican summit alt text
- `images.ai_conference` → AI conference alt text
- `images.tech_summit` → Tech summit alt text
- `images.ai_guide` → AI guide alt text
- `images.featured_story` → Featured story alt text
- `images.news_story` → News story alt text

## HTML Attribute Usage

### Basic Text Translation
```html
<element data-i18n="key.path">Fallback Text</element>
```

### Placeholder Translation
```html
<input data-i18n-placeholder="key.path" placeholder="Fallback">
```

### Title Attribute Translation
```html
<element data-i18n-title="key.path" title="Fallback">
```

### Alt Attribute Translation
```html
<img data-i18n-alt="key.path" alt="Fallback">
```

## JavaScript Translation Functions

### Get Translation
```javascript
const translatedText = t('key.path');
```

### Change Language
```javascript
changeLanguage('it'); // Switch to Italian
```

### Detect Browser Language
```javascript
detectBrowserLanguage(); // Auto-detect and set
```

## Adding New Translations

1. Add the text to `/translations/en.json` with appropriate key
2. Add `data-i18n` attribute to HTML element
3. Run translation generation script: `npm run translate`
4. Verify translations in all languages

## Testing Translations

1. Open the website in browser
2. Use language switcher to test each language
3. Check browser console for missing translation warnings
4. Verify layout doesn't break with longer translations
5. Test on mobile devices

## Supported Languages

- **en** - English (source)
- **it** - Italian (Italiano)
- **es** - Spanish (Español)
- **hu** - Hungarian (Magyar)

## Translation Generation

To regenerate translations after updating en.json:
```bash
cd scripts
npm run translate
```

This will update all language files with new/modified translations.