import { Utils } from '@amateras/utils';

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
        height: element.offsetHeight
    }
    let atBottomY = elementBox.top + elementBox.height;
    let atTopY = elementBox.top - refBox.height - elementBox.height; 
    if (atBottomY > scrollY + innerHeight && atTopY > scrollY) elementBox.top = atTopY;
    let {top, left, width, height} = elementBox;
    if (Utils.isEqual(record, elementBox, ['top', 'left', 'height', 'width'])) return;

    Utils.assign(record, {top, left, width, height})
    element.style.top = `${top}px`;
    element.style.left = `${left}px`
    element.style.width = `${width}px`
}

type FloatRectRecord = {
    top: number;
    left: number;
    height: number;
    width: number;
}