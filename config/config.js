/* MagicMirror² Configuration - Chrystal's Mirror
 *
 * For more information on configuration options:
 * https://docs.magicmirror.builders/configuration/introduction.html
 */

let config = {
	address: "0.0.0.0", // Listen on all interfaces (allows access from network)
	port: 8080,
	basePath: "/",
	ipWhitelist: [], // Allow all IP addresses (set specific IPs for security if needed)

	useHttps: false,
	httpsPrivateKey: "",
	httpsCertificate: "",

	language: "en",
	locale: "en-US",
	logLevel: ["INFO", "LOG", "WARN", "ERROR"],
	timeFormat: 12, // 12-hour format (AM/PM)
	units: "imperial", // Fahrenheit, miles, etc. for US

	modules: [
		{
			module: "alert",
		},
		{
			module: "updatenotification",
			position: "top_bar"
		},
		{
			module: "clock",
			position: "top_left",
			config: {
				displaySeconds: false,
				showPeriod: true,
				showDate: true,
				dateFormat: "dddd, MMMM Do",
				timezone: "America/New_York"
			}
		},
		{
			module: "calendar",
			header: "Chrystal's Calendar",
			position: "top_left",
			config: {
				maximumEntries: 10,
				maximumNumberOfDays: 30,
				displaySymbol: true,
				defaultSymbol: "calendar",
				showLocation: false,
				tableClass: "small",
				fade: true,
				fadePoint: 0.25,
				calendars: [
					{
						name: "Chrystal's iCloud Calendar",
						symbol: "calendar-check",
						url: "https://p113-caldav.icloud.com/published/2/MTA3NzI5NjgzMDEwNzcyOQvSxrAGwChhtImZJfTBxdRWC0WPjUZdRY0v78HtjFWz",
						fetchInterval: 5 * 60 * 1000, // Update every 5 minutes
					},
					{
						name: "US Holidays",
						symbol: "flag-usa",
						url: "https://ics.calendarlabs.com/76/mm3137/US_Holidays.ics",
						fetchInterval: 24 * 60 * 60 * 1000, // Update daily
					}
				]
			}
		},
		{
			module: "compliments",
			position: "lower_third",
			config: {
				updateInterval: 30000,
				fadeSpeed: 4000,
				compliments: {
					anytime: [
						"You've got this, Chrystal!",
						"You're amazing!",
						"Smile! It's going to be a great day!",
						"You make the world a better place!",
						"You're stronger than you know!"
					],
					morning: [
						"Good morning, Chrystal!",
						"Rise and shine, beautiful!",
						"Today is full of possibilities!",
						"You're going to do amazing things today!",
						"Good morning, sunshine!"
					],
					afternoon: [
						"Good afternoon, Chrystal!",
						"Hope you're having a wonderful day!",
						"You're doing great!",
						"Keep up the good work!",
						"Almost there, you've got this!"
					],
					evening: [
						"Good evening, Chrystal!",
						"You deserve to relax!",
						"What a great day you had!",
						"Time to unwind!",
						"You earned this rest!"
					],
					// Weather-based compliments (requires MMM-DynamicWeather or custom module)
					"day_sunny": [
						"It's a beautiful day! Enjoy the sunshine!",
						"Perfect day for a walk outside!"
					],
					"day_cloudy": [
						"Cloudy but still lovely!"
					],
					"rain": [
						"Don't forget your umbrella!",
						"Rain is predicted. Stay dry!",
						"Rainy day ahead - grab your raincoat!"
					],
					"snow": [
						"Snow is predicted for today. Dress warm and stay safe!",
						"Bundle up! It's going to snow!",
						"Winter wonderland today - stay cozy!"
					],
					"thunderstorm": [
						"Storms expected. Stay safe indoors when you can!",
						"Thunderstorms ahead - drive carefully!"
					],
					"fog": [
						"Foggy conditions - drive safely!",
						"Limited visibility today. Take it slow!"
					]
				}
			}
		},
		{
			module: "weather",
			position: "top_right",
			header: "Current Weather",
			config: {
				weatherProvider: "openweathermap",
				type: "current",
				location: "Jersey City",
				locationID: "5099133", // Jersey City, NJ
				apiKey: "0d43b6029fe3e9e66a8716135730b9a0",
				units: "imperial",
				showHumidity: true,
				showFeelsLike: true,
				degreeLabel: true,
				updateInterval: 10 * 60 * 1000, // 10 minutes
				animationSpeed: 1000,
				showPeriod: true,
				showPeriodUpper: false,
				showWindDirection: true,
				showWindDirectionAsArrow: true,
				useBeaufort: false,
				lang: "en",
				decimalSymbol: ".",
				showIndoorTemperature: false,
				showIndoorHumidity: false
			}
		},
		{
			module: "weather",
			position: "top_right",
			header: "Weather Forecast",
			config: {
				weatherProvider: "openweathermap",
				type: "forecast",
				location: "Jersey City",
				locationID: "5099133", // Jersey City, NJ
				apiKey: "0d43b6029fe3e9e66a8716135730b9a0",
				units: "imperial",
				maxNumberOfDays: 5,
				showRainAmount: true,
				updateInterval: 10 * 60 * 1000,
				animationSpeed: 1000,
				fade: true,
				fadePoint: 0.25,
				colored: false,
				lang: "en"
			}
		},
		{
			module: "newsfeed",
			position: "bottom_bar",
			config: {
				feeds: [
					{
						title: "New York Times",
						url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml"
					},
					{
						title: "NPR News",
						url: "https://feeds.npr.org/1001/rss.xml"
					},
					{
						title: "BBC News",
						url: "http://feeds.bbci.co.uk/news/rss.xml"
					},
					{
						title: "CNN Top Stories",
						url: "http://rss.cnn.com/rss/cnn_topstories.rss"
					},
					{
						title: "Local - NJ.com",
						url: "https://www.nj.com/arc/outboundfeeds/rss/?outputType=xml"
					}
				],
				showSourceTitle: true,
				showPublishDate: true,
				broadcastNewsFeeds: true,
				broadcastNewsUpdates: true,
				showDescription: false,
				wrapTitle: true,
				wrapDescription: true,
				truncDescription: true,
				lengthDescription: 400,
				hideLoading: false,
				reloadInterval: 5 * 60 * 1000, // 5 minutes
				updateInterval: 10000, // Scroll every 10 seconds
				animationSpeed: 2500,
				maxNewsItems: 0, // 0 for unlimited
				ignoreOldItems: false,
				ignoreOlderThan: 24 * 60 * 60 * 1000, // 1 day
				removeStartTags: "",
				removeEndTags: "",
				startTags: [],
				endTags: [],
				prohibitedWords: [],
				scrollLength: 500,
				logFeedWarnings: false
			}
		},
		// TOUCH SCREEN MODULE - Install separately (see TOUCH_SETUP.md)
		// Uncomment after installing MMM-SmartTouch
		/*
		{
			module: "MMM-SmartTouch",
			position: "bottom_center",
			config: {
				// Configuration for 32" IR touch frame
				// See: https://github.com/EbenKouao/MMM-SmartTouch
			}
		},
		*/
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") { module.exports = config; }
