/*
 * Google Ads measurement for the WhileAI pages. This is the ONLY analytics on
 * the site, it runs only on the website (never inside the extension), and it
 * loads nothing until a real conversion id is filled in below.
 *
 *   id          the Google Ads conversion id, "AW-" followed by digits
 *   addToChrome label of the "Add to Chrome" click conversion (landing page)
 *   install     label of the install conversion (welcome page, opened once by
 *               the extension on first install)
 *   uninstall   label of the removal event (goodbye page)
 *
 * Attribution works through Google's first-party cookie on ahmetaytar.com,
 * written on the ad click and read on the welcome page 90 days at most. In the
 * EEA, UK and Switzerland the tag starts with storage denied, so those visits
 * are simply not attributed; there is no consent banner to click through.
 */
(function () {
  var ADS = { id: 'AW-18470631917', addToChrome: 'naARCPDF54IdEO3zvedE', install: 'uQz2CNH68YIdEO3zvedE', uninstall: '' };
  window.WHILEAI_ADS = ADS;

  /* Fire a conversion if the tag is live; a silent no-op otherwise. */
  window.whileaiConversion = function (label) {
    if (!label || typeof window.gtag !== 'function') return;
    window.gtag('event', 'conversion', { send_to: ADS.id + '/' + label });
  };

  /* "Add to Chrome" leaves the page at once, which can cut the conversion
     request off mid-flight. Google's own click snippet waits for the tag's
     callback before navigating; this does the same, with a one-second cap so
     a blocked or slow tag never strands the visitor. Modified clicks (new
     tab, new window) do not leave the page, so they are not held. */
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[href^="https://chromewebstore.google.com/detail/"]');
    if (!a) return;
    if (!ADS.addToChrome || typeof window.gtag !== 'function') return;
    var url = a.href;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank') {
      window.gtag('event', 'conversion', { send_to: ADS.id + '/' + ADS.addToChrome, transport_type: 'beacon' });
      return;
    }
    e.preventDefault();
    var gone = false;
    var go = function () { if (!gone) { gone = true; location.href = url; } };
    window.gtag('event', 'conversion', { send_to: ADS.id + '/' + ADS.addToChrome, transport_type: 'beacon', event_callback: go });
    setTimeout(go, 1000);
  });

  /* Carry the campaign from the landing URL onto the store link, so the
     store's own install report can be read per campaign as a second opinion. */
  var q = new URLSearchParams(location.search);
  var fromAd = q.has('gclid') || q.has('utm_source');
  if (fromAd) {
    var utm = new URLSearchParams();
    utm.set('utm_source', q.get('utm_source') || 'google');
    utm.set('utm_medium', q.get('utm_medium') || 'cpc');
    utm.set('utm_campaign', q.get('utm_campaign') || 'ads');
    var links = document.querySelectorAll('a[href^="https://chromewebstore.google.com/detail/"]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      a.href = a.href.split('?')[0] + '?' + utm.toString();
    }
  }

  if (!/^AW-\d+$/.test(ADS.id)) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied',
    region: ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IS','IT','LV','LI','LT','LU','MT','NL','NO','PL','PT','RO','SK','SI','ES','SE','GB','CH']
  });
  window.gtag('js', new Date());
  window.gtag('config', ADS.id);

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ADS.id;
  document.head.appendChild(s);
})();
