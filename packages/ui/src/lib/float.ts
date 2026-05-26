import { Utils } from '@amateras/utils';

export interface FloatOptions {
    
}

export type FloatDisconnect = () => void;

export const float = (reference: Element, self: HTMLElement, options?: FloatOptions) => {
    let record: FloatRectRecord = {
        top: 0,
        left: 0,
        height: 0,
        width: 0,
        bottom: 0
    }
    let resizeObserver = new ResizeObserver(() => update(reference, self, record));
    let listener = () => update(reference, self, record);
    resizeObserver.observe(reference);
    addEventListener('resize', listener);
    update(reference, self, record)
    return () => {
        resizeObserver.disconnect();
        removeEventListener('resize', listener);
    }
}

const update = (reference: Element, element: HTMLElement, record: FloatRectRecord) => {
    let refBox = reference.getBoundingClientRect();
    let elementBox = {
        top: refBox.top + refBox.height + scrollY,
        left: refBox.left,
        width: refBox.width,
        height: element.offsetHeight,
        bottom: innerHeight - refBox.top - scrollY
    }
    let onBottom = elementBox.top + elementBox.height > scrollY + innerHeight && elementBox.top - refBox.height - elementBox.height > scrollY
    let {top, left, width, height, bottom} = elementBox;
    if (Utils.isEqual(record, elementBox, ['top', 'left', 'height', 'width', 'bottom'])) return;

    Utils.assign(record, {top, left, width, height, bottom})
    if (onBottom) {
        element.style.bottom = `${bottom}px`;
        element.style.top = '';
    } else {
        element.style.top = `${top}px`;
        element.style.bottom = '';
    }
    element.style.left = `${left}px`
    element.style.width = `${width}px`
}

type FloatRectRecord = {
    top: number;
    left: number;
    height: number;
    width: number;
    bottom: number;
}