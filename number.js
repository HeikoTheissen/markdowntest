const {createInterface} = require("readline");
const fs = require("fs");

var refs = {};
var number = {};
var match = 0;

function phase1(section) {
	var counter = {};
	return new Promise(function(resolve, reject) {
		createInterface({input: fs.createReadStream(__dirname + "/" + section + ".pmd"), crlfDelay: Infinity})
		.on("line", function(line) {
			var m = line.match(/\s##([a-z]+)(_([a-z]*))?/);
			if (m) {
				counter[m[1]] = (counter[m[1]] || 0) + 1;
				if (m[2]) refs[m[3]] = {number: counter[m[1]], href: `${section}.md#${m[3]}`};
				number[match++] = counter[m[1]] + (m[2] ? `<a name="${m[3]}"></a>` : "");
			}
		})
		.on("close", resolve);
	});
}

function phase2(section) {
	return new Promise(function(resolve, reject) {
		var out = fs.createWriteStream(__dirname + "/" + section + ".md");
		createInterface({input: fs.createReadStream(__dirname + "/" + section + ".pmd"), crlfDelay: Infinity})
		.on("line", function(line) {
			out.write(line.replace(/(\s)##[a-z]+(_[a-z]*)?/, function(m, p) {
				return p + number[match++];
			}).replace(/(\s)##_([a-z]*)\]/g, function(m, p, q) {
				var r = refs[q];
				if (r) return p + `${r.number}](${r.href})`;
				else return p + `UNRESOLVED ${q}]`;
			})
			+ "\n");
		})
		.on("close", resolve);
	});
}

(async function() {
	await phase1("traverse");
	match = 0;
	await phase2("traverse");
})();
