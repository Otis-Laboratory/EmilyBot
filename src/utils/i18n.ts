// Localization for languages.
import i18n from "i18n";
import { join } from "path";

i18n.configure({
  locales: [
    "en",
    "es",
    "de"
  ],
  directory: join(__dirname, "..", "lang"),
  defaultLocale: "en",
  retryInDefaultLocale: true,
  objectNotation: true,
  register: global,

  logWarnFn: function (msg) {
    console.log(msg);
  },

  logErrorFn: function (msg) {
    console.log(msg);
  },

  missingKeyFn: function (locale, value) {
    return value;
  },
  
  mustacheConfig: {
    tags: ["{{", "}}"],
    disable: false
  }
});

i18n.setLocale(process.env.LOCALIZATION || "en");

export { i18n };