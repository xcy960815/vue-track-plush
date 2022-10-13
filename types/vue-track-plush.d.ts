import type { VueConstructor } from "vue"


export type TrackPlushConfig = {

    projectName: string,

    baseURL: string,

    url: string

}

export type ClickEvent = (trackPlushConfig: TrackPlushConfig) => void

export declare const clickEvent: ClickEvent

export type BrowseEvent = (trackPlushConfig: TrackPlushConfig) => void

export declare const browseEvent: BrowseEvent

export type install = (Vue: VueConstructor, options: TrackPlushConfig) => void

export default {
    install: install
};