# Responsive design review

Reviewed the routed frontend pages, shared layout/navigation, inventory tables,
dashboard, report charts/cards, and existing form breakpoint patterns.

## Changes

- Allow the app's main flex content to shrink so wide tables scroll locally.
- Keep a usable table height on short mobile screens using dynamic viewport height;
  preserve the existing desktop height from the `lg` breakpoint.
- Prevent dashboard grid children and large totals from forcing narrow layouts wider.
- Below 1280px, give dense report charts enough horizontal space per item and let
  the plot scroll within its card. Small datasets still fill the available width.
- Use compact report-axis numbers with more label space below 1280px; tooltips
  retain full values. Start the scrollable plot at its value axis in Dari too.
- Let report headings and summary totals wrap on smaller screens instead of hiding
  important information with an ellipsis.

## Preserved

Forms, field organization, application routes, data handling, colors, desktop
grid breakpoints, and the existing dashboard chart sizing. Existing user edits
were retained.

## Verification

- Production build passes.
- Browser checks use isolated, intercepted sample API responses, not live records.
- 60 page/viewport/language combinations checked: all 18 authenticated routes at
  390px in English and Dari, plus dashboard/reports/items at 320, 768, 1024, 1440px.
- Separate populated report checks cover all five widths in both languages, with
  24 items and large monetary totals; charts render at positive dimensions.
- No document-wide horizontal overflow or browser page errors in these checks.
- Visual review covers phone, tablet and desktop report/dashboard screenshots.
- Changed components pass focused lint. Reports has a pre-existing
  `react-hooks/set-state-in-effect` error in `loadReports()`; confirmed against HEAD
  and left unchanged because it is outside responsive styling.

Most CRUD route checks use empty responses; populated dashboard/report data and
wide table containers are covered. Live backend flows, all possible record values,
and physical-device browser behavior are not exhaustively verified.

## All-form follow-up: DevTools preview clipping

The user confirmed that selecting **Fit to window** in Chrome's device toolbar
makes the reported forms visible and usable. The screenshot's 100% preview scale
displayed a 768x1024 canvas taller than the visible browser area. The customer
dialog is centered within that canvas: its measured top is 325.125px, height
373.75px, and bottom 698.875px. The lower part of the preview was off-screen.

No additional application layout code was changed for this follow-up.
Tests target the user's exact `http://localhost:5173` server with isolated sample
API responses. All 12 create-dialog families were checked: items, customers,
vendors, categories, units, currencies, users, sales, purchases, customer payments,
vendor payments, and exchange rates. The corresponding edit flows use the same
dialog and form components.

The audit covers 412x915, 375x667, 768x1024, and 1440x900 in English and Dari.
Separate dark-mode touch tests cover every form at 412x923 in both languages.
Dialogs stay within the viewport and their submit actions remain reachable.
These are browser-emulation checks, not physical-device keyboard tests.

## Overall assessment

The app is broadly responsive, but activity-page text and mobile navigation need
targeted improvements. No application code was changed during this assessment.

58 additional browser scenarios covered populated inventory/customer/vendor/user/
sales/purchase/payment tables, activity searches and results, mobile navigation,
and public login/signup/password pages. Most checks use 320px and 768px widths in
English and Dari; public pages also cover short landscape screens. Previous
dashboard, chart, desktop, and all-dialog results remain applicable.

Confirmed issues:

1. Customer and vendor activity suggestions do not wrap long business names.
   Contact details in the results also do not safely wrap long email addresses.
   Eight focused checks with a valid-length email reproduced document widths of
   566px on a 320px screen, and up to 1049px on a 768px screen. These are actual
   page-wide overflow failures, unlike the earlier DevTools preview clipping.
2. The mobile sidebar remains visible after selecting a page, covering the newly
   navigated content until the drawer is manually dismissed. This was reproduced
   in English and Dari.

Passing areas: populated shared tables contain their horizontal scrolling;
forms fit their tested viewports; public authentication pages fit narrow and short
screens; dashboard/report charts and cards adapt as previously verified. Wide
tables and dense reports intentionally scroll rather than dropping columns/data.

Physical-device keyboards, all possible input values, and every OS/browser
combination remain outside these emulation checks. Fixing the two confirmed
issues does not require changes to the general desktop structure or form fields.
