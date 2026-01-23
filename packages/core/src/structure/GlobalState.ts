import { forEach } from "@amateras/utils";

export class GlobalState {
    static disposers = new Set<(global: GlobalState) => void>()

    dispose() {
        forEach(GlobalState.disposers, disposer => disposer(this))
    }
}