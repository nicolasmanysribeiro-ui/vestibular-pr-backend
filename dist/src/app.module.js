"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const universities_module_1 = require("./universities/universities.module");
const disciplines_module_1 = require("./disciplines/disciplines.module");
const questions_module_1 = require("./questions/questions.module");
const simulations_module_1 = require("./simulations/simulations.module");
const leveling_module_1 = require("./leveling/leveling.module");
const ai_module_1 = require("./ai/ai.module");
const gamification_module_1 = require("./gamification/gamification.module");
const statistics_module_1 = require("./statistics/statistics.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            universities_module_1.UniversitiesModule,
            disciplines_module_1.DisciplinesModule,
            questions_module_1.QuestionsModule,
            simulations_module_1.SimulationsModule,
            leveling_module_1.LevelingModule,
            ai_module_1.AiModule,
            gamification_module_1.GamificationModule,
            statistics_module_1.StatisticsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map