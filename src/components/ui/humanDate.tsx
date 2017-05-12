export const HumanDate = (date: Date): string => {
    let calculateDelta, day, hour, minute, month, week, year;
    minute = 60;
    hour = minute * 60;
    day = hour * 24;
    week = day * 7;
    month = day * 30;
    year = day * 365;

    const now = new Date();
    calculateDelta = () => Math.round((now.getTime() - date.getTime()) / 1000);

    let delta = calculateDelta();
    if (delta > day && delta < week) {
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        delta = calculateDelta();
    }

    switch (false) {
        case !(delta < 30):
            return __("just now");

        case !(delta < minute):
            return __("{0} seconds ago").replace("{0}", "" + delta);

        case !(delta < 2 * minute):
            return __("a minute ago");

        case !(delta < hour):
            return __("{0} minutes ago").replace("{0}", "" + Math.floor(delta / minute));

        case Math.floor(delta / hour) !== 1:
            return __("an hour ago");

        case !(delta < day):
            return __("{0} hours ago").replace("{0}", "" + Math.floor(delta / hour));

        case !(delta < day * 2):
            return __("yesterday");

        case !(delta < week):
            return __("{0} days ago").replace("{0}", "" + Math.floor(delta / day));

        case Math.floor(delta / week) !== 1:
            return __("a week ago");

        case !(delta < month):
            return __("{0} weeks ago").replace("{0}", "" + (Math.floor(delta / week)));

        case Math.floor(delta / month) !== 1:
            return __("a month ago");

        case !(delta < year):
            return __("{0} months ago").replace("{0}", "" + (Math.floor(delta / month)));

        case Math.floor(delta / year) !== 1:
            return __("a year ago");

        case Math.floor(delta / year) >= 1:
            return __("over a year ago");

        default:
            return "";
    }
};

export const HumanTime = (time: number): string => {
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

export const HumanCountdown = (secs: number): string => {
    let ms = secs * 1000;
    let days = Math.floor(secs / (60 * 60 * 24));
    let divisor_for_hours = secs % (60 * 60 * 24);
    let hours = Math.floor(divisor_for_hours / (60 * 60));
    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);
    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let hString: string = hours.toString();
    let mString: string = minutes.toString();
    let sString: string = seconds.toString();

    if (hString.length === 1) {
        hString = "0" + hString;
    }
    if (mString.length === 1) {
        mString = "0" + mString;
    }
    if (sString.length === 1) {
        sString = "0" + sString;
    }

    return days + " " + __("day(s)") + " | " + hString + ":" + mString + ":" + sString;
};