import { spark_1, spark_6, spark_12, ember_1, ember_6, ember_12, inferno_1, inferno_6, inferno_12 } from "../constants/premium.js";
export default function planAmount(plan, duration) {
    // Normalize plan name to lowercase for case-insensitive matching
    const normalizedPlan = plan.toLowerCase();
    switch (normalizedPlan) {
        case 'spark':
        case 'basic': // Legacy support
            if (duration == 1) {
                return spark_1;
            }
            else if (duration == 6) {
                return spark_6;
            }
            else if (duration == 12) {
                return spark_12;
            }
            else {
                return 0;
            }
        case 'ember':
        case 'pro': // Legacy support
            if (duration == 1) {
                return ember_1;
            }
            else if (duration == 6) {
                return ember_6;
            }
            else if (duration == 12) {
                return ember_12;
            }
            else {
                return 0;
            }
        case 'inferno':
        case 'deluxe': // Legacy support
            if (duration == 1) {
                return inferno_1;
            }
            else if (duration == 6) {
                return inferno_6;
            }
            else if (duration == 12) {
                return inferno_12;
            }
            else {
                return 0;
            }
        default:
            return 0;
    }
}
