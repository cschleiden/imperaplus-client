export default (time: number): string => {

    switch (false) {
        case !(time === 300):
            return __("5 Minutes");

        case !(time === 600):
            return __("10 Minutes");

        case !(time === 18000):
            return __("10 Hours");

        case !(time === 86400):
            return __("1 Day");

        case !(time === 172800):
            return __("2 Days");

        default:
            return "";
    }
};