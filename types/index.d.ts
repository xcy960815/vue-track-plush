import { Vue as _Vue } from "vue"

export type Method = 'GET' | 'POST'

export type TrackPlushConfig = {

    projectName: string,

    baseURL: string,

    url: string

    pageName?: string

    pageUrl?: string

    userAgent?: Navigator['userAgent']

    method?: Method
}

export type ClickEvent = (trackPlushConfig: TrackPlushConfig) => void

export declare const clickEvent: ClickEvent

export type BrowseEvent = (trackPlushConfig: TrackPlushConfig) => void

export declare const browseEvent: BrowseEvent


export default {
    install(Vue: typeof _Vue, options: TrackPlushConfig): void
}