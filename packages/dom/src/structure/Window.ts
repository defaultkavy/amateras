import { Document } from "./Document";
import { History } from "./History";
import { Location } from "./Location";
import { Storage } from "./Storage";

export class Window extends EventTarget {
    document = new Document();
    location = new Location();
    history = new History();
    sessionStorage = new Storage();
    localStorage = new Storage();
    
    scrollTo = () => {}
}