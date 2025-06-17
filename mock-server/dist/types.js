"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationClass = exports.CloudProvider = void 0;
var CloudProvider;
(function (CloudProvider) {
    CloudProvider[CloudProvider["UNSPECIFIED"] = 0] = "UNSPECIFIED";
    CloudProvider[CloudProvider["AWS"] = 1] = "AWS";
    CloudProvider[CloudProvider["AZURE"] = 2] = "AZURE";
})(CloudProvider || (exports.CloudProvider = CloudProvider = {}));
var RecommendationClass;
(function (RecommendationClass) {
    RecommendationClass[RecommendationClass["UNSPECIFIED_RECOMMENDATION"] = 0] = "UNSPECIFIED_RECOMMENDATION";
    RecommendationClass[RecommendationClass["COMPUTE_RECOMMENDATION"] = 1] = "COMPUTE_RECOMMENDATION";
    RecommendationClass[RecommendationClass["NETWORKING_RECOMMENDATION"] = 2] = "NETWORKING_RECOMMENDATION";
    RecommendationClass[RecommendationClass["DATA_PROTECTION_RECOMMENDATION"] = 3] = "DATA_PROTECTION_RECOMMENDATION";
    RecommendationClass[RecommendationClass["APPLICATION_RECOMMENDATION"] = 4] = "APPLICATION_RECOMMENDATION";
    RecommendationClass[RecommendationClass["AUTHENTICATION_RECOMMENDATION"] = 5] = "AUTHENTICATION_RECOMMENDATION";
    RecommendationClass[RecommendationClass["COMPLIANCE_RECOMMENDATION"] = 6] = "COMPLIANCE_RECOMMENDATION";
})(RecommendationClass || (exports.RecommendationClass = RecommendationClass = {}));
