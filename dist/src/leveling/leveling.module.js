"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelingModule = void 0;
const common_1 = require("@nestjs/common");
const leveling_service_1 = require("./leveling.service");
const leveling_controller_1 = require("./leveling.controller");
const ai_module_1 = require("../ai/ai.module");
let LevelingModule = class LevelingModule {
};
exports.LevelingModule = LevelingModule;
exports.LevelingModule = LevelingModule = __decorate([
    (0, common_1.Module)({
        imports: [ai_module_1.AiModule],
        controllers: [leveling_controller_1.LevelingController],
        providers: [leveling_service_1.LevelingService],
    })
], LevelingModule);
//# sourceMappingURL=leveling.module.js.map