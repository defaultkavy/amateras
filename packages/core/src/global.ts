import * as core from './index';

declare global {
    export import $ = core.$
    
    export interface ProtoEventMap {}
}