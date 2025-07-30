export const debounce = () => {
    let timer: ReturnType<typeof setTimeout>;
    return (fn: Function, timeout: number) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(fn, timeout);
    }
}