interface IdOption {
	id?: string;
}

interface AmpifyOptions {
	analytics?: IdOption;
	adsense?: IdOption;
}

const ampCSSBoilerplate = '<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>';

const getAmpScript = (analytics: boolean, adsense: boolean) => {
	const baseScript = `<script async src="https://cdn.ampproject.org/v0.js"></script>`;
	const analyticsScript = `<script async custom-element="amp-analytics" src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"></script>`;
	const adsenseScript = `<script async custom-element="amp-auto-ads" src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js"></script>`;

	let res = baseScript;
	if (analytics) {
		res += analyticsScript;
	}
	if (adsense) {
		res += adsenseScript;
	}
	return res;
}
/**
 * @param {string} html - a Html string
 * @param {Object} html - a n options {analytics: {id}, adsense: {id}}
 *
 */
export default (html: string, options?: AmpifyOptions) => {
	// Add ⚡ to html tag
	html = html.replace(/<html/gi, '<html ⚡')

	// Combine css into single tag
	let styleConcat = ''
	// @ts-ignore
	html = html.replace(/<style[^>]*data-vue-ssr[^>]*>(.*?)?<\/style>/gi, (match, sub) => {
		styleConcat += sub
		return ''
	})
	// @ts-ignore
	html = html.replace(/<style\>(.*?)?<\/style>/gi, (match, sub) => {
		styleConcat = sub + styleConcat
		return ''
	})

	// Remove preload and prefetch tags
	html = html.replace(/<link[^>]*rel="(?:preload|prefetch)?"[^>]*>/gi, '')

	// Remove amphtml tag
	html = html.replace(/<link[^>]*rel="(?:amphtml)?"[^>]*>/gi, '')

	// Replace img tags with amp-img
	// @ts-ignore
	html = html.replace(/<img([^>]*)>/gi, (match, sub) => {
		return `<amp-img ${sub} layout=responsive></amp-img>`
	})

	// Remove data attributes from tags
	html = html.replace(/\s*data-(v|n)-(?:[^=>]*="[^"]*"|[^=>\s]*)/gi, '')
	html = html.replace(/javascript:void\(0\)/gi, '#')

	// Replace unwanted attribute
	// @ts-ignore
	html = html.replace(/<div[^>]*name=(?:[^=>]*="[^"]*"|[^=>\s]*)/gi, (match) => {
		return match.replace(/name/gi, 'data-name')
	})

	// Replace unwanted attribute
	// @ts-ignore
	html = html.replace(/<a[^>]*source="[a-z|-]*"/gi, (match) => {
		return match.replace(/source=/gi, 'data-source=')
	})

	// Remove JS script tags except for ld+json
	html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, (match) => {
		return (/application\/ld\+json/gi.test(match)) ? match : ''
	})

	// Add AMP script before </head>
	html = html.replace('</head>', getAmpScript(Boolean(options && options.analytics), Boolean(options && options.adsense)) +  '</head>')

	// Add style
	html = html.replace('</head>', `
	<style amp-custom>
		${styleConcat.replace(/\[data-v-[a-z|\d|\s]*]/gi, '').replace(/!important/gi, '')}
	</style>

	${ampCSSBoilerplate}

	</head>`)

	// Add AMP analytics
	if (options && options.analytics && options.analytics.id) {
		html = html.replace('</body>',
			`
			<amp-analytics type='googleanalytics'>
			<script type='application/json'>
				{
					"vars": {
						"account": "${options.analytics.id}"
					},
					"triggers": {
						"trackPageview": {
							"on": "visible",
							"request": "pageview"
						}
					}
				}
			</script>
		</amp-analytics>
	</body>`)
	}

	if (options && options.adsense && options.adsense.id) {
		html = html.replace('</body>',
			`
			<amp-auto-ads type="adsense" data-ad-client="${options.adsense.id}"></amp-auto-ads>
	</body>`)
	}

	return html
}
