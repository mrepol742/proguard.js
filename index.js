import fs from "fs";
import { createHash } from "crypto";

let pre = [];
let index_f;

export function scanFiles(loc) {
    let packagejs;
    try {
        packagejs = JSON.parse(fs.readFileSync(loc + "/package.json"));
    } catch (err) {
        return console.error("Unable to find package.json!");
    }
    fs.readdir(
        loc,
        {
            encoding: null,
            withFileTypes: true,
            recursive: true,
        },
        async function (err, files) {
            if (err) return console.error(err);
            if (files.length > 0) {
                // find all *.js files
                for (const file in files) {
                    const fileName = files[file].name;
                    const path = files[file].path;
                    if (!path.includes("/node_modules") && !path.includes("/.git")) {
                        if (/\.js$/.test(fileName) && files[file].isFile()) {
                            console.log("JS file found: " + path + "/" + fileName);
                            const _name = fileName.replace(".js", "");
                            const f_h = createHash("sha256")
                                .update(new Date().getTime() + _name)
                                .digest("hex");
                            if (_name == "index") {
                                index_f = f_h;
                            }
                            pre.push({ name: _name, inputDir: path, outputDir: functionWithoutAName(path), encryptedName: f_h });
                        }
                    }
                }
                const distPath = loc + "-dist";
                if (fs.existsSync(distPath)) {
                    /// remve the dist dir if exists
                    fs.rmSync(distPath, { recursive: true }, (err) => {
                        if (err) console.error(err);
                    });
                }
                fs.mkdirSync(distPath);
                // fs.cpSync(loc, distPath, { recursive: true }, (err) => { if (err) console.error(err); } );

                let package_json_n = JSON.parse(fs.readFileSync(loc + "/package.json", "utf8"));
                pre.find((p) => {
                    if (p.inputDir == loc && p.name == "index") {
                        index_f = p.encryptedName;
                    }
                })
                package_json_n.main = index_f;
                package_json_n.scripts.start = package_json_n.scripts.start.replace("index.js", package_json_n.main);
                package_json_n.scripts.dev = package_json_n.scripts.dev.replace("index.js", package_json_n.main);
                fs.writeFileSync(
                    distPath + "/package.json",
                    JSON.stringify(package_json_n),
                    // see reference https://nodejs.org/api/fs.html#file-system-flags
                    { flag: "as+" }
                );

                for (const p in pre) {
                    console.log("processing.... " + pre[p].name);
                    let f_content = fs.readFileSync(pre[p].inputDir + "/" + pre[p].name + ".js", "utf8");
                    for (const p1 in pre) {
                        const current_1 = pre[p1];
                        const regExp = new RegExp('(from "(.*?)' + current_1.name + '.js"|require\("(.*?)' + current_1.name + '.js"\))');
                        if (regExp.test(f_content)) {
                            f_content = f_content.replace(regExp, 'from "' + current_1.encryptedName + '.js"').replace(regExp, 'require/("' + current_1.encryptedName + '.js/")');
                        }
                    }
                    fs.writeFileSync(
                        distPath + "/" + pre[p].encryptedName + ".js",
                        f_content, { flag: "as+" }
                    );
                }
            } else {
                console.error("No files found: " + loc);
            }
        }
    );
}

function functionWithoutAName(loc) {
    loc = loc.split("/");
    loc[1] = loc[1] + "-dist";
    return loc.join("/");
}

scanFiles("../project-orion");