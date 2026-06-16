"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisciplinesModule = void 0;
const common_1 = require("@nestjs/common");
const disciplines_service_1 = require("./disciplines.service");
const disciplines_controller_1 = require("./disciplines.controller");
let DisciplinesModule = class DisciplinesModule {
};
exports.DisciplinesModule = DisciplinesModule;
exports.DisciplinesModule = DisciplinesModule = __decorate([
    (0, common_1.Module)({
        controllers: [disciplines_controller_1.DisciplinesController],
        providers: [disciplines_service_1.DisciplinesService],
        exports: [disciplines_service_1.DisciplinesService],
    })
], DisciplinesModule);
//# sourceMappingURL=disciplines.module.js.map