import { _Object_assign, isEqual } from "@amateras/utils";

export interface FloatOptions {
    
}

export type FloatDisconnect = () => void;

export const float = (reference: Element, self: HTMLElement, options?: FloatOptions) => {
    let record: FloatRectRecord = {
        top: 0,
        left: 0,
        height: 0,
        width: 0
    }
    let resizeObserver = new ResizeObserver(() => update(reference, self, record));
    let listener = () => update(reference, self, record);
    resizeObserver.observe(reference);
    window.addEventListener('resize', listener);
    return () => {
        resizeObserver.disconnect();
        window.removeEventListener('resize', listener);
    }
}

const update = (reference: Element, {style}: HTMLElement, record: FloatRectRecord) => {
    let rect = reference.getBoundingClientRect();
    let rectWindow = {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height
    }
    let {top, left, width, height} = rectWindow;
    if (isEqual(record, rectWindow, ['top', 'left', 'height', 'width'])) return;
    _Object_assign(record, {top, left, width, height})
    style.top = `${height + top}px`;
    style.left = `${left}px`
    style.width = `${width}px`
}

type FloatRectRecord = {
    top: number;
    left: number;
    height: number;
    width: number;
}