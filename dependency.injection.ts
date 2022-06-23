import QuizeCategoryModel from "./Model/quize.category.model";

import { container } from "tsyringe";
import QuizeCategoryService from "./services/quize.category.service";

container.register(QuizeCategoryModel, {
  useClass: QuizeCategoryModel,
});

container.register(QuizeCategoryService, {
  useClass: QuizeCategoryService,
});
