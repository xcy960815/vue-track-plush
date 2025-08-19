import { VueConstructor } from "vue"

export type Method = 'GET' | 'POST'

export type TrackPlushConfig = {
    projectName: string,
    baseURL: string,
    url: string,
    pageName?: string,
    pageUrl?: string,
    userAgent?: Navigator['userAgent'],
    method?: Method,
    buttonName?: string,
    [key: string]: any
}

export type ClickEvent = (trackPlushConfig: TrackPlushConfig) => void

export declare const clickEvent: ClickEvent

export type BrowseEvent = (trackPlushConfig: TrackPlushConfig) => void

export declare const browseEvent: BrowseEvent

declare const _default: {
    install(Vue: VueConstructor, options?: Partial<TrackPlushConfig>): void
}

export default _default