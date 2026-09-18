# ahmetaytar.com

The site behind ahmetaytar.com. Plain HTML and one stylesheet, no build step
and no framework: it is a handful of static pages and it should stay cheap to
change.

```
index.html              studio page, lists the projects
style.css               the only stylesheet, shared by every page
whileai/index.html      the whileAI product page
whileai/upgrade/        WhileAI Pro pricing; checkout.js holds the three Polar checkout links
whileai/terms/          terms of sale (the store requires these once anything is sold)
whileai/refund/         refund policy
whileai/privacy/        privacy policy for the extension (linked from the store listing)
whileai/selectors.json  the selector config every install polls; bump `version` or nothing changes
whileai/img/            product images, generated, do not edit by hand
```

## The images are generated

`whileai/img/*.png` is built from the extension repo, so a UI change becomes a
site change without anyone retouching a screenshot:

```bash
cd ../WhileAI/whileai
npm run build && node scripts/seed-demo-data.mjs && node scripts/capture-ui.mjs
node scripts/make-site-images.mjs        # writes into ../../ahmetaytar-site/whileai/img
```

The same sources produce the Chrome Web Store screenshots
(`node scripts/make-store-shots.mjs`), which is why the site and the listing
look like the same product.

## Deploying

Cloudflare Pages builds from this repository. There is no build command and no
output directory to set: the root of the repo IS the site.

## Adding a project

Copy the `whileai/` folder shape: a page at `<project>/index.html`, its images
under `<project>/img/`, and a card in the project list on `index.html`.
