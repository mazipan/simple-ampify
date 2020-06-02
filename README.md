# simple-ampify

⚡ A simple plain HTML to AMP converter for personal use

![](https://img.shields.io/npm/v/simple-ampify.svg) ![](https://badgen.net/bundlephobia/minzip/simple-ampify) ![](https://img.shields.io/npm/dt/simple-ampify.svg)

## Install

```bash
$ yarn add simple-ampify
# OR
$ npm i simple-ampify
```

## Usage

```js
import ampify from 'simple-ampify';

const result = ampify(htmlString)
```

## With Options

```js
import ampify from 'simple-ampify';

const options = {
	analytics : {
		id: 'UA-XXXXXX-XX'
	},
	adsense : {
		id: 'XXXXXXXXX'
	}
}
const result = ampify(htmlString, options)
```

## Support me

- Via [trakteer](https://trakteer.id/mazipan)
- Direct support, [send me an email](mailto:mazipanneh@gmail.com)

---

Copyright © 2020 Built with ❤️ by Irfan Maulana
