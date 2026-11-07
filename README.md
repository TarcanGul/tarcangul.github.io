# My Personal Website

This is my personal website.

https://tarcangul.github.io/

## Contact form

The `/contact` page sends messages through [Web3Forms](https://web3forms.com/).

1. Create a Web3Forms access key using the inbox that should receive messages.
2. For local development, copy `.env.example` to `.env` and set `PUBLIC_WEB3FORMS_ACCESS_KEY`.
3. For GitHub Pages, add a repository Actions variable named `PUBLIC_WEB3FORMS_ACCESS_KEY` under Settings → Secrets and variables → Actions → Variables, then rebuild the site.

This is a public form access key, embedded in the generated page, not an email password or private API credential. The destination email address is not included in the page. Without a key, the form is disabled and shows an unavailable message.

After configuration, send a test from `/contact` and confirm receipt in the chosen inbox (including the spam folder). The form keeps entered text if sending fails. Without JavaScript, Web3Forms handles submission and displays its success page.

The same access key can be used locally and on the live site; the submission endpoint stays `https://api.web3forms.com/submit`. If you enable Web3Forms' paid [domain restriction](https://docs.web3forms.com/getting-started/pro-features/restrict-to-domain), allow `tarcangul.github.io` without a protocol or path. Test again after deployment: Web3Forms may [block some hosted subdomains](https://docs.web3forms.com/getting-started/troubleshooting) independently of your key's settings.

## 👀 Want to learn Astro?

Feel free to check [Astro's documentation](https://docs.astro.build) or jump into Astro's [Discord server](https://astro.build/chat).
