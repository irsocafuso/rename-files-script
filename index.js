#!/usr/bin/env node

/**
 * rename-musics
 * script to rename musics
 *
 * @author Wilson S Filho <https://github.com/irsocafuso>
 */

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const stringsToRemove = require('./utils/strings-to-remove.json');

const fs = require('fs');
const readline = require("readline");

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const renameFiles = () => {
	fs.readdir(`${process.cwd()}`, (error, files) => {
		if (error) console.log('ERROR: ' + error);

		files = files.map(function (fileName) {

			return {
				name: fileName,
				time: fs.statSync(process.cwd() + '/' + fileName).mtime.getTime()
			};
		}).sort(function (a, b) {
			return a.time - b.time;
		}).map(function (v) {
			return v.name;
		});

		files.forEach((fileName, index) => {
			const pad = ('000' + index).slice(-3)

			let newFileName = fileName
			stringsToRemove.forEach((stringToRemove) => {
				newFileName = newFileName.replace(stringToRemove, "")
			})
			const formatedFileName = `${pad}${newFileName}`
			fs.rename(`${process.cwd()}/${fileName}`, `${process.cwd()}/${formatedFileName}`, function (error) {
				if (error) console.log('ERROR: ' + error);
			});
		})
	})
}

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);

	debug && log(flags);

	rl.question(`This is the path that you wanna to execute the script "${process.cwd()}"? [Press y/n] `, function (input) {
		if (input !== 'y') {
			process.exit(0);
		}

		renameFiles()

		rl.close();
	});


})();
