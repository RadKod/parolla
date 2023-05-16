[![changelog][changelog-src]][changelog-href]
[![License][license-src]][license-href]

<p align="center">
  <a href="https://parolla.app" target="_blank"> 
    <img src='/static/meta/logo.png' width="96"/>
  </a>
</p>

<p align="center">
  <p align="center">
    <sub>TR</sub>
  </p>
  <p align="center">
    <b>parolla - Kelime oyunu</b>
  </p>
  <p align="center">
  Günlük soruları çöz ve rekabete katıl. Kendi soru-cevap setini oluştur, oyuncuların oluşturduğu eğlenceli soruları çöz
  </p>
</p>

<p align="center">
  <a href="https://parolla.app" target="_blank"> 
    <img src='/static/meta/preview-tr.png' width="256"/>
  </a>
</p>

<br>

<p align="center">
  <p align="center">
    <sub>EN</sub>
  </p>
  <p align="center">
    <b>parolla - Word game</b>
  </p>
  <p align="center">
  Solve daily questions and join the competition. Create your own Q&A set and solve fun questions created by players
  </p>
</p>

<p align="center">
  <a href="https://parolla.app/en" target="_blank"> 
    <img src='/static/meta/preview-en.png' width="256"/>
  </a>
</p>

<p align="center">
  <p align="center"><sub>Created by<sub></p>
    <p align="center">
	    <a href="https://radkod.com" target="_blank">
			  <img src='/static/meta/radkod-signature.png' width="128" />
		  </a>
    </p>
</p>

<p align="center">
<a href="https://github.com/RadKod/parolla" target="__blank"><img alt="GitHub stars" src="https://img.shields.io/github/stars/RadKod/parolla?style=social"></a>
</p>

<p align="center">
  <a href="https://parolla.app" target="_blank">Website</a>
</p>

<div align="center">
<sub>Buy me a coffee - <a href="https://www.buymeacoffee.com/RadKod">Sponsorship 💖</a></sub><br>
</div>

## Getting Started

### Play now ⚡️

[WEBSITE](https://parolla.app)

<a href="https://play.google.com/store/apps/details?id=app.parolla" target="_blank">
  <img src='/static/meta/play-store-logo.png' width="36" />
</a>
<a href="https://apps.apple.com/tr/app/parolla-kelime-oyunu/id6448075358" target="_blank">
  <img src='/static/meta/app-store-logo.png' width="36" />
</a>

---

## Installation

### Clone project

```bash
git clone https://github.com/RadKod/parolla.git
```

### Development

#### Local

```bash
cd parolla

# install dependencies
yarn install

# run at localhost:3000
yarn dev
```

#### Build

Check [Nuxt2 commands](https://nuxtjs.org/docs/get-started/commands/) for various deployment targets
parolla using `static` target mode and `ssr: false`

```bash
# generate static project
yarn generate

# serve production mode
yarn start
```

#### Linter

```bash
# run eslint
yarn lint:eslint

# run eslint fix
yarn lint:eslint:fix

# run stylelint
yarn lint:stylelint

# run stylelint fix
yarn lint:stylelint:fix

# run prettier
yarn prettier
```

#### Git
Using [Conventional Commits](https://www.conventionalcommits.org), commitizen, commitizen cli

```bash
# add files
git add .

# generate commit message
yarn commit # or yarn cz

# push
git push
```

#### Release & Changelog
Using [changelogen](https://github.com/unjs/changelogen) for release & changelog management, arguments are the same as changelogen

```bash
# run changelogen
yarn changelog
```

---

Back-End development repository:
[https://github.com/RadKod/parolla-backend](https://github.com/RadKod/parolla-backend)

---

## Sponsorship

You can sponsor us for the continuity of our projects:

<p align="left">
  <a href="https://buymeacoffee.com/RadKod">
    <img src='https://www.buymeacoffee.com/assets/img/custom_images/yellow_img.png'/>
  </a>
</p>

## License

[MIT License](./LICENSE)

Copyright (c) RadKod <info@radkod.com>

<p align="left">
  <a href="https://radkod.com">
    <img src='/static/meta/radkod-signature.png'/>
  </a>
</p>

<!-- Badges -->
[changelog-src]: https://img.shields.io/static/v1?label=%F0%9F%93%96&message=Release%20Notes%20|%20CHANGELOG&color=blue
[changelog-href]: ./CHANGELOG.md

[license-src]: https://img.shields.io/badge/License-MIT-blue.svg
[license-href]: ./LICENSE
