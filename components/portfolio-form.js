"use client";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PortfolioForm;
var react_1 = require("react");
var supabase_1 = require("@/lib/supabase");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var card_1 = require("@/components/ui/card");
var image_uploader_1 = require("./image-uploader");
var BUCKET_NAME = "portfolio-images";
function uploadImageToStorage(path, image) {
    return __awaiter(this, void 0, void 0, function () {
        var response, blob, extension, filePath, _a, data, error, publicUrlResponse, error_1;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, fetch(image)];
                case 1:
                    response = _d.sent();
                    if (!response.ok) {
                        console.warn("Image fetch failed", response.status, image);
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, response.blob()];
                case 2:
                    blob = _d.sent();
                    extension = blob.type.split("/")[1] || "png";
                    filePath = "".concat(path, ".").concat(extension);
                    return [4 /*yield*/, supabase_1.supabase.storage.from(BUCKET_NAME).upload(filePath, blob, {
                            contentType: blob.type || "image/png",
                            upsert: true,
                        })];
                case 3:
                    _a = _d.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.warn("Supabase upload failed", error);
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, supabase_1.supabase.storage
                            .from(BUCKET_NAME)
                            .getPublicUrl(data.path)];
                case 4:
                    publicUrlResponse = _d.sent();
                    return [2 /*return*/, (_c = (_b = publicUrlResponse.data) === null || _b === void 0 ? void 0 : _b.publicUrl) !== null && _c !== void 0 ? _c : null];
                case 5:
                    error_1 = _d.sent();
                    console.warn("Upload image to storage failed", error_1);
                    return [2 /*return*/, null];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function PortfolioForm(_a) {
    var _this = this;
    var onGenerate = _a.onGenerate, isGenerating = _a.isGenerating, setIsGenerating = _a.setIsGenerating;
    var _b = (0, react_1.useState)({
        name: "",
        email: "",
        phone: "",
        linkedin: "",
        github: "",
        twitter: "",
        website: "",
        tagline: "",
        aboutHint: "",
        skills: "",
        experience: "",
        useAI: true,
        template: "Modern Glass",
        research: "",
        achievements: "",
        events: "",
        languages: "",
    }), formData = _b[0], setFormData = _b[1];
    var _c = (0, react_1.useState)(null), profilePic = _c[0], setProfilePic = _c[1];
    var _d = (0, react_1.useState)([]), projects = _d[0], setProjects = _d[1];
    var _e = (0, react_1.useState)({ name: "", description: "", image: null }), currentProject = _e[0], setCurrentProject = _e[1];
    var _f = (0, react_1.useState)(false), generatingDescription = _f[0], setGeneratingDescription = _f[1];
    var _g = (0, react_1.useState)(false), generatingImage = _g[0], setGeneratingImage = _g[1];
    var _h = (0, react_1.useState)(null), enhancingField = _h[0], setEnhancingField = _h[1];
    var handleInputChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value, type = _a.type, checked = _a.checked;
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = type === "checkbox" ? checked : value, _a)));
        });
    };
    var handleGenerateDescription = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, data_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!currentProject.name.trim()) {
                        alert("Please enter a project name first");
                        return [2 /*return*/];
                    }
                    setGeneratingDescription(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch("/api/generate-description", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                projectName: currentProject.name,
                                skills: formData.skills,
                            }),
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok)
                        throw new Error("Failed to generate description");
                    return [4 /*yield*/, response.json()];
                case 3:
                    data_1 = _a.sent();
                    setCurrentProject(function (prev) { return (__assign(__assign({}, prev), { description: data_1.description })); });
                    return [3 /*break*/, 6];
                case 4:
                    error_2 = _a.sent();
                    console.error("Error:", error_2);
                    alert("Failed to generate description. You can write one manually.");
                    return [3 /*break*/, 6];
                case 5:
                    setGeneratingDescription(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleGenerateImage = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, data_2, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!currentProject.name.trim()) {
                        alert("Please enter a project name first");
                        return [2 /*return*/];
                    }
                    setGeneratingImage(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch("/api/generate-image", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                projectName: currentProject.name,
                                projectDescription: currentProject.description,
                            }),
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok)
                        throw new Error("Failed to generate image");
                    return [4 /*yield*/, response.json()];
                case 3:
                    data_2 = _a.sent();
                    setCurrentProject(function (prev) { return (__assign(__assign({}, prev), { image: data_2.imageUrl })); });
                    return [3 /*break*/, 6];
                case 4:
                    error_3 = _a.sent();
                    console.error("Error:", error_3);
                    alert("Failed to generate image. You can upload one manually.");
                    return [3 /*break*/, 6];
                case 5:
                    setGeneratingImage(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var uploadResource = function (prefix, imageUrl) { return __awaiter(_this, void 0, void 0, function () {
        var key;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!imageUrl)
                        return [2 /*return*/, null];
                    key = "".concat(prefix, "-").concat(Date.now());
                    return [4 /*yield*/, uploadImageToStorage(key, imageUrl)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
    var handleAddProject = function () {
        if (!currentProject.name.trim()) {
            alert("Please enter a project name");
            return;
        }
        var projectWithId = __assign(__assign({}, currentProject), { id: Date.now() });
        setProjects(function (prev) { return __spreadArray(__spreadArray([], prev, true), [projectWithId], false); });
        setCurrentProject({ name: "", description: "", image: null });
    };
    var handleRemoveProject = function (id) {
        setProjects(function (prev) { return prev.filter(function (p) { return p.id !== id; }); });
    };
    var handleGeneratePortfolio = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var response, data, profilePicUrl, projectUploads, saveResponse, saveResult, saveError_1, error_4;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!formData.name || !formData.email || !formData.skills) {
                        alert("Please fill in: Name, Email, and Skills");
                        return [2 /*return*/];
                    }
                    setIsGenerating(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 11, 12, 13]);
                    return [4 /*yield*/, fetch("/api/generate-portfolio", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(__assign(__assign({}, formData), { projects: projects, profilePic: profilePic })),
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok)
                        throw new Error("Failed to generate portfolio");
                    return [4 /*yield*/, response.json()
                        // Upload profile picture and project images to storage before saving
                    ];
                case 3:
                    data = _a.sent();
                    return [4 /*yield*/, uploadResource("profile-pic", profilePic)];
                case 4:
                    profilePicUrl = _a.sent();
                    return [4 /*yield*/, Promise.all(projects.map(function (project, index) { return __awaiter(_this, void 0, void 0, function () {
                            var imageUrl;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, uploadResource("project-".concat(index), project.image)];
                                    case 1:
                                        imageUrl = _a.sent();
                                        return [2 /*return*/, __assign(__assign({}, project), { image: imageUrl || project.image })];
                                }
                            });
                        }); }))
                        // Save portfolio to Supabase silently (no user notification)
                    ];
                case 5:
                    projectUploads = _a.sent();
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 9, , 10]);
                    return [4 /*yield*/, fetch("/api/save-portfolio", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(__assign(__assign({}, formData), { projects: projectUploads, profilePic: profilePicUrl || profilePic, portfolioHtml: data.portfolioHtml })),
                        })];
                case 7:
                    saveResponse = _a.sent();
                    return [4 /*yield*/, saveResponse.json()];
                case 8:
                    saveResult = _a.sent();
                    if (!saveResponse.ok) {
                        console.error("Portfolio save failed:", saveResult);
                        alert("Portfolio save failed: ".concat(saveResult.details || saveResult.error));
                    }
                    else {
                        console.log("Portfolio saved successfully:", saveResult.data);
                    }
                    return [3 /*break*/, 10];
                case 9:
                    saveError_1 = _a.sent();
                    console.error("Save operation failed:", saveError_1);
                    alert("Portfolio could not be saved to Supabase.");
                    return [3 /*break*/, 10];
                case 10:
                    alert("Portfolio generated successfully! ✨");
                    onGenerate(data.portfolioHtml, data.resumeHtml);
                    return [3 /*break*/, 13];
                case 11:
                    error_4 = _a.sent();
                    console.error("Error:", error_4);
                    alert("Failed to generate portfolio. Please try again.");
                    return [3 /*break*/, 13];
                case 12:
                    setIsGenerating(false);
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    }); };
    var handleEnhanceText = function (fieldName, fieldValue) { return __awaiter(_this, void 0, void 0, function () {
        var response, enhancedText_1, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!fieldValue.trim()) {
                        alert("Please enter some text first");
                        return [2 /*return*/];
                    }
                    setEnhancingField(fieldName);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch("/api/enhance-text", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ text: fieldValue, type: fieldName }),
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok)
                        throw new Error("Enhancement failed");
                    return [4 /*yield*/, response.json()];
                case 3:
                    enhancedText_1 = (_a.sent()).enhancedText;
                    setFormData(function (prev) {
                        var _a;
                        return (__assign(__assign({}, prev), (_a = {}, _a[fieldName] = enhancedText_1, _a)));
                    });
                    return [3 /*break*/, 6];
                case 4:
                    error_5 = _a.sent();
                    alert("Failed to enhance text. Please try again.");
                    console.error("Enhancement error:", error_5);
                    return [3 /*break*/, 6];
                case 5:
                    setEnhancingField(null);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    return (<form onSubmit={handleGeneratePortfolio} className="space-y-5">
      {/* Basic Info */}
      <card_1.Card className="border-border/50 bg-card/50 backdrop-blur animate-fade-in hover:border-border/80 transition-colors">
        <card_1.CardHeader>
          <card_1.CardTitle className="text-xl">Basic Information</card_1.CardTitle>
          <card_1.CardDescription>Your personal details and contact info</card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label_1.Label htmlFor="name">Full Name *</label_1.Label>
              <input_1.Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Your name" required className="mt-1 bg-input/50 border-border/50 focus:border-accent transition-colors"/>
            </div>
            <div>
              <label_1.Label htmlFor="tagline">Professional Tagline</label_1.Label>
              <input_1.Input id="tagline" name="tagline" value={formData.tagline} onChange={handleInputChange} placeholder="Full Stack Developer" className="mt-1 bg-input/50 border-border/50 focus:border-accent transition-colors"/>
            </div>
            <div>
              <label_1.Label htmlFor="email">Email *</label_1.Label>
              <input_1.Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="name@example.com" required className="mt-1 bg-input/50 border-border/50 focus:border-accent transition-colors"/>
            </div>
            <div>
              <label_1.Label htmlFor="phone">Phone</label_1.Label>
              <input_1.Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1 (555) 000-0000" className="mt-1 bg-input/50 border-border/50 focus:border-accent transition-colors"/>
            </div>
          </div>
        </card_1.CardContent>
      </card_1.Card>

      {/* Profile Picture */}
      <card_1.Card className="border-border/50 bg-card/50 backdrop-blur animate-fade-in hover:border-border/80 transition-colors">
        <card_1.CardHeader>
          <card_1.CardTitle className="text-xl">Profile Picture</card_1.CardTitle>
          <card_1.CardDescription>Upload a professional photo</card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent>
          <image_uploader_1.default onImageChange={setProfilePic} label="Profile Picture"/>
        </card_1.CardContent>
      </card_1.Card>

      {/* Social & Web Links */}
      <card_1.Card className="border-border/50 bg-card/50 backdrop-blur animate-fade-in hover:border-border/80 transition-colors">
        <card_1.CardHeader>
          <card_1.CardTitle className="text-xl">Professional Links</card_1.CardTitle>
          <card_1.CardDescription>Connect your online profiles</card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent className="space-y-4">
          <div>
            <label_1.Label htmlFor="linkedin">LinkedIn URL</label_1.Label>
            <input_1.Input id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleInputChange} placeholder="https://linkedin.com/in/janedoe" className="mt-1 bg-input/50 border-border/50 focus:border-accent transition-colors"/>
          </div>
          <div>
            <label_1.Label htmlFor="github">GitHub URL</label_1.Label>
            <input_1.Input id="github" name="github" value={formData.github} onChange={handleInputChange} placeholder="https://github.com/janedoe" className="mt-1 bg-input/50 border-border/50 focus:border-accent transition-colors"/>
          </div>
          <div>
            <label_1.Label htmlFor="twitter">Twitter URL</label_1.Label>
            <input_1.Input id="twitter" name="twitter" value={formData.twitter} onChange={handleInputChange} placeholder="https://twitter.com/janedoe" className="mt-1 bg-input/50 border-border/50 focus:border-accent transition-colors"/>
          </div>
          <div>
            <label_1.Label htmlFor="website">Personal Website</label_1.Label>
            <input_1.Input id="website" name="website" value={formData.website} onChange={handleInputChange} placeholder="https://janedoe.com" className="mt-1 bg-input/50 border-border/50 focus:border-accent transition-colors"/>
          </div>
        </card_1.CardContent>
      </card_1.Card>

      {/* Skills & Experience */}
      <card_1.Card className="border-border/50 bg-card/50 backdrop-blur animate-fade-in hover:border-border/80 transition-colors">
        <card_1.CardHeader>
          <card_1.CardTitle className="text-xl">Skills & Experience</card_1.CardTitle>
          <card_1.CardDescription>Your expertise and professional background</card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent className="space-y-4">
          <div>
            <label_1.Label htmlFor="skills">Skills * (comma-separated)</label_1.Label>
            <input_1.Input id="skills" name="skills" value={formData.skills} onChange={handleInputChange} placeholder="React, TypeScript, Python, Node.js, AWS" required className="mt-1 bg-input/50 border-border/50 focus:border-accent transition-colors"/>
          </div>
          <div>
            <label_1.Label htmlFor="aboutHint">About Me Hint</label_1.Label>
            <textarea id="aboutHint" name="aboutHint" value={formData.aboutHint} onChange={handleInputChange} placeholder="Passionate about building scalable web applications and learning new technologies" rows={3} className="w-full px-3 py-2 border border-border/50 rounded-md text-sm bg-input/50 text-foreground focus:border-accent transition-colors"/>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label_1.Label htmlFor="experience">Work Experience</label_1.Label>
              <button_1.Button type="button" onClick={function () { return handleEnhanceText("experience", formData.experience); }} disabled={enhancingField === "experience"} size="sm" variant="outline" className="text-xs">
                {enhancingField === "experience" ? "Enhancing..." : "✨ Enhance"}
              </button_1.Button>
            </div>
            <textarea id="experience" name="experience" value={formData.experience} onChange={handleInputChange} placeholder="Senior Developer at Tech Corp (2020-Present)&#10;Describe your role and achievements..." rows={3} className="w-full px-3 py-2 border border-border/50 rounded-md text-sm bg-input/50 text-foreground focus:border-accent transition-colors"/>
          </div>
        </card_1.CardContent>
      </card_1.Card>

      {/* Projects */}
      <card_1.Card className="border-border/50 bg-card/50 backdrop-blur animate-fade-in hover:border-border/80 transition-colors">
        <card_1.CardHeader>
          <card_1.CardTitle className="text-xl">Projects</card_1.CardTitle>
          <card_1.CardDescription>Add your projects - AI will generate descriptions and images</card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent className="space-y-4">
          <div className="mt-1 space-y-3 p-4 bg-muted/20 border border-border/50 rounded-lg">
            <div>
              <label_1.Label htmlFor="projectName">Project Name *</label_1.Label>
              <input_1.Input id="projectName" value={currentProject.name} onChange={function (e) { return setCurrentProject(function (prev) { return (__assign(__assign({}, prev), { name: e.target.value })); }); }} placeholder="E-commerce Platform" className="mt-1 bg-input/50 border-border/50 focus:border-accent transition-colors"/>
            </div>

            <div>
              <label_1.Label htmlFor="projectDesc">Description (or auto-generate)</label_1.Label>
              <textarea id="projectDesc" value={currentProject.description} onChange={function (e) { return setCurrentProject(function (prev) { return (__assign(__assign({}, prev), { description: e.target.value })); }); }} placeholder="Project description will appear here..." rows={2} className="mt-1 w-full px-3 py-2 border border-border/50 rounded-md text-sm bg-input/50 text-foreground focus:border-accent transition-colors"/>
            </div>

            <div className="flex gap-2">
              <button_1.Button type="button" onClick={handleGenerateDescription} disabled={generatingDescription} variant="outline" className="flex-1 bg-accent/10 hover:bg-accent/20 border-accent/50 hover:border-accent text-accent transition-colors">
                {generatingDescription ? "✨ Generating..." : "✨ Auto-Generate Description"}
              </button_1.Button>
              <button_1.Button type="button" onClick={handleGenerateImage} disabled={generatingImage} variant="outline" className="flex-1 bg-accent/10 hover:bg-accent/20 border-accent/50 hover:border-accent text-accent transition-colors">
                {generatingImage ? "🖼️ Generating..." : "🖼️ Generate Image"}
              </button_1.Button>
            </div>

            {!currentProject.image && (<image_uploader_1.default onImageChange={function (img) { return setCurrentProject(function (prev) { return (__assign(__assign({}, prev), { image: img })); }); }} label="Or upload project screenshot"/>)}

            {currentProject.image && (<div className="relative w-full h-32 bg-muted/50 rounded-lg overflow-hidden border border-border/50">
                <img src={currentProject.image || "/placeholder.svg"} alt="Project" className="w-full h-full object-cover"/>
                <button type="button" onClick={function () { return setCurrentProject(function (prev) { return (__assign(__assign({}, prev), { image: null })); }); }} className="absolute top-2 right-2 bg-destructive/80 hover:bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs transition-colors">
                  Remove
                </button>
              </div>)}

            <button_1.Button type="button" onClick={handleAddProject} className="w-full bg-primary hover:bg-primary/90 transition-colors">
              Add Project
            </button_1.Button>
          </div>

          {projects.length > 0 && (<div className="space-y-2 animate-slide-up">
              <label_1.Label>Added Projects ({projects.length})</label_1.Label>
              <div className="space-y-2">
                {projects.map(function (project) { return (<div key={project.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50 hover:border-border/80 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{project.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                    </div>
                    <button_1.Button type="button" variant="ghost" size="sm" onClick={function () { return handleRemoveProject(project.id); }}>
                      ✕
                    </button_1.Button>
                  </div>); })}
              </div>
            </div>)}
        </card_1.CardContent>
      </card_1.Card>

      {/* Research Profile */}
      <card_1.Card className="border-border/50 bg-card/50 backdrop-blur animate-fade-in hover:border-border/80 transition-colors">
        <card_1.CardHeader>
          <card_1.CardTitle className="text-xl">Research Profile</card_1.CardTitle>
          <card_1.CardDescription>Add research work, publications or academic contributions</card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent className="space-y-4">
          <div>
            <label_1.Label htmlFor="research">Research Details</label_1.Label>
            <textarea id="research" name="research" value={formData.research || ""} onChange={handleInputChange} placeholder="List your research publications, projects or areas of interest..." rows={3} className="mt-1 w-full px-3 py-2 border border-border/50 rounded-md text-sm bg-input/50 text-foreground focus:border-accent transition-colors"/>
          </div>
        </card_1.CardContent>
      </card_1.Card>

      {/* Achievements / Awards */}
      <card_1.Card className="border-border/50 bg-card/50 backdrop-blur animate-fade-in hover:border-border/80 transition-colors">
        <card_1.CardHeader>
          <card_1.CardTitle className="text-xl">Achievements & Awards</card_1.CardTitle>
          <card_1.CardDescription>Highlight your recognitions</card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label_1.Label htmlFor="achievements">Achievements / Awards</label_1.Label>
              <button_1.Button type="button" onClick={function () { return handleEnhanceText("achievements", formData.achievements); }} disabled={enhancingField === "achievements"} size="sm" variant="outline" className="text-xs">
                {enhancingField === "achievements" ? "Enhancing..." : "✨ Enhance"}
              </button_1.Button>
            </div>
            <textarea id="achievements" name="achievements" value={formData.achievements || ""} onChange={handleInputChange} placeholder="e.g., Best Developer Award 2023, Hackathon Winner..." rows={3} className="mt-1 w-full px-3 py-2 border border-border/50 rounded-md text-sm bg-input/50 text-foreground focus:border-accent transition-colors"/>
          </div>
        </card_1.CardContent>
      </card_1.Card>

      {/* Conferences / Seminars / Trainings */}
      <card_1.Card className="border-border/50 bg-card/50 backdrop-blur animate-fade-in hover:border-border/80 transition-colors">
        <card_1.CardHeader>
          <card_1.CardTitle className="text-xl">Conferences / Seminars / Trainings</card_1.CardTitle>
          <card_1.CardDescription>Events you participated in</card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label_1.Label htmlFor="events">List of Events Attended</label_1.Label>
              <button_1.Button type="button" onClick={function () { return handleEnhanceText("events", formData.events); }} disabled={enhancingField === "events"} size="sm" variant="outline" className="text-xs">
                {enhancingField === "events" ? "Enhancing..." : "✨ Enhance"}
              </button_1.Button>
            </div>
            <textarea id="events" name="events" value={formData.events || ""} onChange={handleInputChange} placeholder="Conference on AI 2024, Web Summit 2023, React Workshop..." rows={3} className="mt-1 w-full px-3 py-2 border border-border/50 rounded-md text-sm bg-input/50 text-foreground focus:border-accent transition-colors"/>
          </div>
        </card_1.CardContent>
      </card_1.Card>

      {/* Languages */}
      <card_1.Card className="border-border/50 bg-card/50 backdrop-blur animate-fade-in hover:border-border/80 transition-colors">
        <card_1.CardHeader>
          <card_1.CardTitle className="text-xl">Languages</card_1.CardTitle>
          <card_1.CardDescription>Languages you speak</card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent className="space-y-4">
          <div>
            <label_1.Label htmlFor="languages">Languages (comma-separated)</label_1.Label>
            <input_1.Input id="languages" name="languages" value={formData.languages || ""} onChange={handleInputChange} placeholder="English, Urdu, Arabic, French" className="mt-1 bg-input/50 border-border/50 focus:border-accent transition-colors"/>
          </div>
        </card_1.CardContent>
      </card_1.Card>

      {/* Settings */}
      <card_1.Card className="border-border/50 bg-card/50 backdrop-blur animate-fade-in hover:border-border/80 transition-colors">
        <card_1.CardHeader>
          <card_1.CardTitle className="text-xl">Settings</card_1.CardTitle>
          <card_1.CardDescription>Customize your portfolio generation</card_1.CardDescription>
        </card_1.CardHeader>
        <card_1.CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <input type="checkbox" id="useAI" name="useAI" checked={formData.useAI} onChange={handleInputChange} className="w-4 h-4 rounded border-input cursor-pointer"/>
            <label_1.Label htmlFor="useAI" className="cursor-pointer">
              Enable AI Enhancement (generates professional content & images)
            </label_1.Label>
          </div>

          <div>
            <label_1.Label htmlFor="template">Template</label_1.Label>
            <select id="template" name="template" value={formData.template} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-border/50 rounded-md text-sm bg-input/50 text-foreground focus:border-accent transition-colors">
              <option>Modern Glass</option>
              <option>Minimal Dark</option>
              <option>Creative Gradient</option>
            </select>
          </div>
        </card_1.CardContent>
      </card_1.Card>

      {/* Submit Button */}
      <button_1.Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:shadow-lg hover:shadow-primary/50" disabled={isGenerating}>
        {isGenerating ? "✨ Generating with AI..." : "✨ Generate Portfolio"}
      </button_1.Button>
    </form>);
}
