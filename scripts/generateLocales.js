const fsExtra = require('fs-extra');
const find = require("find");

const outputDir = "src";
const locales = [
	"en_US",
	"fr_FR",
	"de_DE",
	"it_IT",
	"es_ES",
	"pt_BR",
	"zh_CN",
	"zh_TW",
	"ko_KR",
	"ja_JP",
	"sv_SE"
];

mergeTranslations();

function mergeTranslations() {
	for (var i=0; i<locales.length; i++) {
		mergeLocaleFiles(locales[i]);
	}

	function mergeLocaleFiles(locale) {
		var translationFileDir = outputDir + "/app/";
		var translationFilePattern = new RegExp("^src[/\\\\]app[/\\\\].+[/\\\\]nls[/\\\\].+_" + locale + "\\.json$");
		var componentTranslationFiles = find.fileSync(translationFilePattern, translationFileDir);
		var allStreams = {};

		componentTranslationFiles.forEach(function (file) {
			var data = readJsonFiles(file);
			Object.assign(allStreams, data);
		})

		writeJsonFiles(allStreams, locale);

		function readJsonFiles(sourceFiles) {
			return fsExtra.readJsonSync(sourceFiles);
		}

		function writeJsonFiles(data, locale) {
			var outputName = locale + ".json";
			var outputLocDir = outputDir + "/locales/";
			return fsExtra.outputJsonSync(outputLocDir + outputName, data, {spaces: '\t'});
		}
	}
}
