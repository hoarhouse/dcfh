# DCF Hungary Translation Verification Checklist

## Pre-Testing Setup
- [ ] Clear browser cache and localStorage
- [ ] Open browser developer console
- [ ] Navigate to the DCF Hungary website
- [ ] Ensure all translation files are present in `/translations/`

## Language Switcher Testing

### Desktop View
- [ ] Language switcher visible in top-right corner
- [ ] All 4 language buttons present (EN, IT, ES, HU)
- [ ] Active language has visual indicator (highlighted)
- [ ] Clicking each button changes language immediately
- [ ] Language preference persists after page refresh

### Mobile View
- [ ] Language switcher appears in hamburger menu
- [ ] All 4 language options visible
- [ ] Language selection works on mobile
- [ ] Mobile menu closes after language selection

## English (EN) Translation Check

### Navigation
- [ ] Home link displays correctly
- [ ] Blog link displays correctly
- [ ] About Us link displays correctly
- [ ] Initiatives link displays correctly
- [ ] Contact link displays correctly
- [ ] Donate link displays correctly
- [ ] Resources link displays correctly

### Hero Section
- [ ] Main title: "DCF Prepares to Launch Ethical AI Portal"
- [ ] Subtitle displays complete text
- [ ] "Read Full Story" button
- [ ] "Donate" button

### TikTok Cards
- [ ] Card 1 title and subtitle
- [ ] Card 2 title and subtitle
- [ ] Card 3 title and subtitle

### Newsletter Section
- [ ] "FREE" badge
- [ ] Newsletter title
- [ ] Description text
- [ ] Email placeholder text
- [ ] "Get Free Guide" button

### Change Makers
- [ ] Section title "Change Makers"
- [ ] Loading message if applicable
- [ ] "See All Change Makers →" link

### Take Action Section
- [ ] Section title "Take Action Now"
- [ ] Live event badge
- [ ] Town hall card content
- [ ] Partnership card content
- [ ] Survey card content
- [ ] Community join section

### Initiatives
- [ ] Peace Initiative card
- [ ] Health Initiative card
- [ ] Research Initiative card
- [ ] Education Initiative card
- [ ] "See All Initiatives" link

### Events
- [ ] Section title "Events"
- [ ] Event cards with titles and descriptions
- [ ] Time indicators (days ago, week ago)

### Resources
- [ ] Section title "Resources"
- [ ] Loading message if applicable
- [ ] "See All Resources" link

## Italian (IT) Translation Check

### Critical Translations
- [ ] Navigation: "Casa, Blog, Chi Siamo, Iniziative, Contatto, Dona, Risorse"
- [ ] Hero title: "DCF Si Prepara a Lanciare il Portale di IA Etica"
- [ ] Hero button: "Leggi la Storia Completa"
- [ ] No missing translations (check console)
- [ ] Text fits properly in UI elements
- [ ] No layout breaking

## Spanish (ES) Translation Check

### Critical Translations
- [ ] Navigation: "Inicio, Blog, Acerca de Nosotros, Iniciativas, Contacto, Donar, Recursos"
- [ ] Hero title: "DCF Se Prepara para Lanzar el Portal de IA Ética"
- [ ] Hero button: "Leer Historia Completa"
- [ ] No missing translations (check console)
- [ ] Text fits properly in UI elements
- [ ] No layout breaking

## Hungarian (HU) Translation Check

### Critical Translations
- [ ] Navigation: "Főoldal, Blog, Rólunk, Kezdeményezések, Kapcsolat, Adományozás, Források"
- [ ] Hero title: "A DCF Felkészül az Etikus AI Portál Elindítására"
- [ ] Hero button: "Teljes Történet Olvasása"
- [ ] No missing translations (check console)
- [ ] Text fits properly in UI elements
- [ ] No layout breaking

## Console Verification

### Error Checking
- [ ] No JavaScript errors in console
- [ ] No 404 errors for translation files
- [ ] No "translation not found" warnings
- [ ] LocalStorage shows correct language preference

### Translation Loading
- [ ] "Loading translations for: [language]" message appears
- [ ] "Translations loaded successfully" confirmation
- [ ] "Using cached translations" on subsequent switches

## Dynamic Content Testing

### Navigation Generation
- [ ] Mobile menu items translated
- [ ] Desktop menu items translated
- [ ] Dropdown menus (if any) translated

### Form Elements
- [ ] Input placeholders translated
- [ ] Button texts translated
- [ ] Select/dropdown options translated

## Browser Compatibility

### Chrome/Edge
- [ ] All features work correctly
- [ ] Language persists across sessions

### Firefox
- [ ] All features work correctly
- [ ] Language persists across sessions

### Safari
- [ ] All features work correctly
- [ ] Language persists across sessions

### Mobile Browsers
- [ ] iOS Safari functionality
- [ ] Chrome mobile functionality
- [ ] Language switcher accessible

## Performance Testing

### Load Times
- [ ] Initial page load acceptable
- [ ] Language switch happens instantly
- [ ] No noticeable lag when changing languages
- [ ] Cached translations load faster

### Network Requests
- [ ] Translation files load only once per language
- [ ] Files are properly cached
- [ ] No duplicate requests

## Edge Cases

### Missing Translations
- [ ] English fallback works for missing keys
- [ ] Console warning appears for missing translations
- [ ] UI remains functional

### Network Issues
- [ ] Site works if translation file fails to load
- [ ] Error handling for failed requests
- [ ] Fallback to English if needed

## Accessibility

### Screen Readers
- [ ] Language change announced
- [ ] Translated content readable
- [ ] ARIA labels updated (if applicable)

### Keyboard Navigation
- [ ] Language switcher keyboard accessible
- [ ] Tab order maintained after translation
- [ ] Focus management correct

## Layout Integrity

### Text Overflow
- [ ] No text cutoff in buttons
- [ ] No text overflow in cards
- [ ] Line heights appropriate
- [ ] Responsive breakpoints still work

### RTL Languages (Future)
- [ ] Ready for RTL implementation
- [ ] CSS supports direction changes
- [ ] Layout mirrors correctly

## Final Verification

### Complete Test
- [ ] Switch through all 4 languages sequentially
- [ ] Refresh page and verify persistence
- [ ] Clear localStorage and test auto-detection
- [ ] Mobile and desktop both verified
- [ ] All sections have translations
- [ ] No console errors or warnings

## Sign-off

- [ ] English (EN) - Fully Verified
- [ ] Italian (IT) - Fully Verified
- [ ] Spanish (ES) - Fully Verified
- [ ] Hungarian (HU) - Fully Verified

**Tested By:** _________________
**Date:** _________________
**Browser/Device:** _________________

## Notes/Issues Found

```
[Document any issues or observations here]
```