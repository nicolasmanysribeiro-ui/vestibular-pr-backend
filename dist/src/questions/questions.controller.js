"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const questions_service_1 = require("./questions.service");
const answer_question_dto_1 = require("./dto/answer-question.dto");
let QuestionsController = class QuestionsController {
    questionsService;
    constructor(questionsService) {
        this.questionsService = questionsService;
    }
    getNext(req, disciplineId, universityId) {
        return this.questionsService.getNextAdaptiveQuestion(req.user.userId, disciplineId, universityId);
    }
    answer(req, dto) {
        return this.questionsService.answerQuestion(req.user.userId, dto);
    }
};
exports.QuestionsController = QuestionsController;
__decorate([
    (0, common_1.Get)('next'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('disciplineId')),
    __param(2, (0, common_1.Query)('universityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "getNext", null);
__decorate([
    (0, common_1.Post)('answer'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, answer_question_dto_1.AnswerQuestionDto]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "answer", null);
exports.QuestionsController = QuestionsController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('questions'),
    __metadata("design:paramtypes", [questions_service_1.QuestionsService])
], QuestionsController);
//# sourceMappingURL=questions.controller.js.map