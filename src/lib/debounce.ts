export function debounce(debouncedFunction: (...args: any[]) => void, waitMs: number): (...args: any[]) => void {
    let timeoutHandle: number = null;

    return () => {
        if (timeoutHandle) {
            clearTimeout(timeoutHandle);
        }

        timeoutHandle = setTimeout(() => {
            timeoutHandle = null;

            debouncedFunction();
        }, waitMs);
    };
}