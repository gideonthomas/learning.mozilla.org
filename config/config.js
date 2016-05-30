var IN_STATIC_SITE = (typeof (window) !== 'undefined');
var GENERATING_STATIC_SITE = !IN_STATIC_SITE;
var ENABLE_PUSHSTATE = (IN_STATIC_SITE &&
                        window.history.pushState &&
                        window.history.replaceState);
var DEV_SERVER_PORT = 8008;
var ORIGIN;

if (IN_STATIC_SITE) {
  ORIGIN = window.location.protocol + '//' + window.location.host;
} else {
  ORIGIN = process.env.ORIGIN;

  if (!ORIGIN) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ORIGIN must be defined in production.');
    } else {
      ORIGIN = 'http://localhost:' + DEV_SERVER_PORT;
    }
  }
}

exports.IN_STATIC_SITE = IN_STATIC_SITE;
exports.GENERATING_STATIC_SITE = GENERATING_STATIC_SITE;
exports.ENABLE_PUSHSTATE = ENABLE_PUSHSTATE;
exports.IN_TEST_SUITE = (typeof describe == 'function');
exports.DEV_SERVER_PORT = DEV_SERVER_PORT;

exports.ENABLE_BADGES = !!process.env.ENABLE_BADGES;
exports.ENCRYPT_CAMPAIGN_URL = "https://mzl.la/encrypt";
exports.FLICKR_MAKER_PARTY = 'https://www.flickr.com/photos/mozilladrumbeat/sets/72157654235131834/';
exports.GIGABIT_SITE_LINK = 'https://mozilla.org/gigabit';
exports.HIVE_LEARNING_NETWORKS_URL = 'https://hivelearningnetworks.org';
exports.LIGHT_BEAM_URL = "https://addons.mozilla.org/firefox/downloads/latest/363974/addon-363974-latest.xpi";
exports.MAKE_METADATA_URL = process.env.MAKE_METADATA_URL || 'https://{username}.mywebmaker.org/makes.json';
exports.MOZFEST_SITE_LINK = 'https://mozillafestival.org';
exports.ORIGIN = ORIGIN;
exports.TEACH_THE_WEB_EMAIL = 'teachtheweb@mozillafoundation.org';
exports.THIMBLE = 'https://thimble.mozilla.org/';
exports.TWITTER_HANDLE = '@MozLean';
exports.TWITTER_LINK = 'https://twitter.com/MozLean';
exports.WEBMAKER = 'https://webmaker.org';
exports.WORDPRESS_SITE_URL = process.env.WORDPRESS_SITE_URL || '';
exports.XRAY_GOGGLES_LINK = 'https://goggles.mozilla.org/';
