// window and document
export let _window: Window;
export let _document: Document;

export const setGlobal = (w: Window) => {
    _window = w;
    _document = w.document;
}

if (typeof window !== 'undefined') setGlobal(window);