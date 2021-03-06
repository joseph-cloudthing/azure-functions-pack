import * as fs from "fs";
import * as mkdirp from "mkdirp";
import { ncp } from "ncp";
import * as nodepath from "path";
import * as rimraf from "rimraf";

export type FilterCallBack = (name: string) => boolean;

export class FileHelper {
    public static readdir(path: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            fs.readdir(path, (err, files) => {
                if (err) {
                    return reject(err);
                }
                resolve(files);
            });
        });
    }

    public static stat(path: string): Promise<fs.Stats> {
        return new Promise((resolve, reject) => {
            fs.stat(path, (err, stat) => {
                if (err) {
                    return reject(err);
                }
                resolve(stat);
            });
        });
    }

    public static readFileUtf8(path: string): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(path, "utf8", (err, content: string) => {
                if (err) {
                    return reject(err);
                }
                resolve(content);
            });
        });
    }

    public static exists(path: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            fs.access(path, (err) => {
                resolve(!err);
            });
        });
    }

    public static readFileAsJSON(path: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            try {
                const content = await FileHelper.readFileUtf8(path);
                resolve(JSON.parse(content));
            } catch (err) {
                reject(err);
            }

        });
    }

    public static overwriteFileUtf8(path: string, content: string): Promise<any> {
        return new Promise((resolve, reject) => {
            fs.truncate(path, async (err) => {
                if (err) {
                    return reject(err);
                }
                await this.writeFileUtf8(path, content).catch(reject).then(resolve, reject);
            });

        });
    }

    public static writeFileUtf8(path: string, content: string): Promise<any> {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, content, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    public static mkdir(path: string): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.mkdir(path, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    public static rimraf(path: string): Promise<string> {
        return new Promise((resolve, reject) => {
            rimraf(path, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    public static rename(pathOld: string, pathNew: string) {
        return new Promise((resolve, reject) => {
            fs.rename(pathOld, pathNew, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    public static cp(source: string, destination: string, filter?: RegExp | FilterCallBack): Promise<{}> {
        const options: any = {};
        options.clobber = true;
        options.errs = process.stderr;
        if (filter) {
            options.filter = filter;
        }

        return new Promise(async (resolve, reject) => {
            if (!await FileHelper.exists(nodepath.dirname(destination))) {
                await FileHelper.mkdirp(nodepath.dirname(destination));
            }

            ncp(source, destination, options, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });

    }

    public static mkdirp(pathToCreate: string): Promise<string> {
        return new Promise((resolve, reject) => {
            mkdirp(pathToCreate, (err, made) => {
                if (err) {
                    return reject(err);
                }
                resolve(made);
            });
        });
    }
}
