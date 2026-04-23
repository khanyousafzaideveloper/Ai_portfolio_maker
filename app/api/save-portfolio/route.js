"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
exports.GET = GET;
var supabase_1 = require("@/lib/supabase");
var server_1 = require("next/server");
var BUCKET_NAME = "portfolio-images";
function isDataUrl(value) {
    return typeof value === "string" && value.startsWith("data:");
}
function uploadDataUrl(path, dataUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, meta, base64, mimeMatch, contentType, extension, buffer, error, data;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = dataUrl.split(","), meta = _a[0], base64 = _a[1];
                    if (!base64) {
                        throw new Error("Invalid image data");
                    }
                    mimeMatch = meta.match(/data:(.*?);base64/);
                    contentType = (mimeMatch === null || mimeMatch === void 0 ? void 0 : mimeMatch[1]) || "image/png";
                    extension = contentType.split("/")[1] || "png";
                    buffer = Buffer.from(base64, "base64");
                    return [4 /*yield*/, supabase_1.supabase.storage
                            .from(BUCKET_NAME)
                            .upload("".concat(path, ".").concat(extension), buffer, {
                            contentType: contentType,
                            upsert: true,
                        })];
                case 1:
                    error = (_b.sent()).error;
                    if (error) {
                        throw error;
                    }
                    data = supabase_1.supabase.storage.from(BUCKET_NAME).getPublicUrl("".concat(path, ".").concat(extension)).data;
                    return [2 /*return*/, data.publicUrl];
            }
        });
    });
}
function uploadRemoteImage(path, imageUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var response, contentType, extension, buffer, _a, _b, error, data;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, fetch(imageUrl)];
                case 1:
                    response = _c.sent();
                    if (!response.ok) {
                        throw new Error("Failed to download remote image");
                    }
                    contentType = response.headers.get("content-type") || "image/png";
                    extension = contentType.split("/")[1] || "png";
                    _b = (_a = Buffer).from;
                    return [4 /*yield*/, response.arrayBuffer()];
                case 2:
                    buffer = _b.apply(_a, [_c.sent()]);
                    return [4 /*yield*/, supabase_1.supabase.storage
                            .from(BUCKET_NAME)
                            .upload("".concat(path, ".").concat(extension), buffer, {
                            contentType: contentType,
                            upsert: true,
                        })];
                case 3:
                    error = (_c.sent()).error;
                    if (error) {
                        throw error;
                    }
                    data = supabase_1.supabase.storage.from(BUCKET_NAME).getPublicUrl("".concat(path, ".").concat(extension)).data;
                    return [2 /*return*/, data.publicUrl];
            }
        });
    });
}
function uploadImage(path, image) {
    return __awaiter(this, void 0, void 0, function () {
        var imageString;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!image) {
                        return [2 /*return*/, null];
                    }
                    if (!isDataUrl(image)) return [3 /*break*/, 2];
                    return [4 /*yield*/, uploadDataUrl(path, image)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    imageString = image;
                    if (!(typeof imageString === "string" && imageString.startsWith("http"))) return [3 /*break*/, 4];
                    return [4 /*yield*/, uploadRemoteImage(path, imageString)];
                case 3: return [2 /*return*/, _a.sent()];
                case 4: return [2 /*return*/, null];
            }
        });
    });
}
function POST(request) {
    return __awaiter(this, void 0, void 0, function () {
        var portfolioData, userId_1, timestamp_1, profilePicUrl, projects, _a, _b, insertedData, error, error_1;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, request.json()];
                case 1:
                    portfolioData = _c.sent();
                    if (!portfolioData.name || !portfolioData.email) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Name and email are required" }, { status: 400 })];
                    }
                    userId_1 = portfolioData.email.replace(/[^a-zA-Z0-9_-]/g, "_");
                    timestamp_1 = Date.now();
                    profilePicUrl = null;
                    if (!portfolioData.profilePic) return [3 /*break*/, 3];
                    return [4 /*yield*/, uploadImage("profiles/".concat(userId_1, "/profile-").concat(timestamp_1), portfolioData.profilePic)];
                case 2:
                    profilePicUrl = _c.sent();
                    _c.label = 3;
                case 3:
                    if (!Array.isArray(portfolioData.projects)) return [3 /*break*/, 5];
                    return [4 /*yield*/, Promise.all(portfolioData.projects.map(function (project, index) { return __awaiter(_this, void 0, void 0, function () {
                            var imageUrl, uploadedImageUrl, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (!project || typeof project !== "object")
                                            return [2 /*return*/, project];
                                        imageUrl = project.image;
                                        if (!imageUrl) return [3 /*break*/, 2];
                                        return [4 /*yield*/, uploadImage("projects/".concat(userId_1, "/").concat(timestamp_1, "-").concat(index), imageUrl)];
                                    case 1:
                                        _a = _b.sent();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        _a = null;
                                        _b.label = 3;
                                    case 3:
                                        uploadedImageUrl = _a;
                                        return [2 /*return*/, __assign(__assign({}, project), { image: uploadedImageUrl || imageUrl || null })];
                                }
                            });
                        }); }))];
                case 4:
                    _a = _c.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _a = [];
                    _c.label = 6;
                case 6:
                    projects = _a;
                    return [4 /*yield*/, supabase_1.supabase
                            .from("portfolios")
                            .insert([
                            {
                                name: portfolioData.name,
                                email: portfolioData.email,
                                phone: portfolioData.phone,
                                linkedin: portfolioData.linkedin,
                                github: portfolioData.github,
                                twitter: portfolioData.twitter,
                                website: portfolioData.website,
                                tagline: portfolioData.tagline,
                                about_hint: portfolioData.aboutHint,
                                skills: portfolioData.skills,
                                experience: portfolioData.experience,
                                research_profile: portfolioData.researchProfile,
                                achievements: portfolioData.achievements,
                                events: portfolioData.events,
                                languages: portfolioData.languages,
                                template: portfolioData.template,
                                profile_pic: profilePicUrl,
                                projects: projects,
                                portfolio_html: portfolioData.portfolioHtml,
                                created_at: new Date().toISOString(),
                            },
                        ])
                            .select()
                            .maybeSingle()];
                case 7:
                    _b = _c.sent(), insertedData = _b.data, error = _b.error;
                    if (error) {
                        console.error("Save error:", error);
                        return [2 /*return*/, server_1.NextResponse.json({
                                error: "Save failed",
                                details: error.message || JSON.stringify(error),
                            }, { status: 500 })];
                    }
                    return [2 /*return*/, server_1.NextResponse.json({ success: true, data: insertedData }, { status: 201 })];
                case 8:
                    error_1 = _c.sent();
                    console.error("Save error:", error_1);
                    return [2 /*return*/, server_1.NextResponse.json({
                            error: "Save failed",
                            details: error_1 instanceof Error ? error_1.message : JSON.stringify(error_1),
                        }, { status: 500 })];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function GET(request) {
    return __awaiter(this, void 0, void 0, function () {
        var email, _a, data, error, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    email = request.nextUrl.searchParams.get("email");
                    if (!email) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Email required" }, { status: 400 })];
                    }
                    return [4 /*yield*/, supabase_1.supabase
                            .from("portfolios")
                            .select("*")
                            .eq("email", email)
                            .order("created_at", { ascending: false })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.error("Fetch error:", error);
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Fetch failed" }, { status: 500 })];
                    }
                    return [2 /*return*/, server_1.NextResponse.json({ success: true, data: data }, { status: 200 })];
                case 2:
                    error_2 = _b.sent();
                    console.error("Fetch error:", error_2);
                    return [2 /*return*/, server_1.NextResponse.json({ error: "Fetch failed" }, { status: 500 })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
