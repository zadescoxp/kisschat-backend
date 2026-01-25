import { basic_1, basic_12, basic_6, deluxe_12, deluxe_6, deluxe_1, pro_12, pro_6, pro_1 } from "../constants/premium.js";

export default function planAmount(plan: string, duration: number): number {
    switch (plan) {
        case 'basic':
            if (duration == 1) {
                return basic_1
            } else if (duration == 6) {
                return basic_6;
            } else if (duration == 12) {
                return basic_12;
            } else {
                return 0;
            }
            break;

        case 'pro':
            if (duration == 1) {
                return pro_1
            } else if (duration == 6) {
                return pro_6;
            } else if (duration == 12) {
                return pro_12;
            } else {
                return 0;
            }
            break;

        case 'deluxe':
            if (duration == 1) {
                return deluxe_1
            } else if (duration == 6) {
                return deluxe_6;
            } else if (duration == 12) {
                return deluxe_12;
            } else {
                return 0;
            }
            break;

        default:
            return 0;
    }
}