import { Vue as _Vue } from "vue"

export type Method = 'GET' | 'POST'

export type TrackPlushConfig = {
    projectName: string,

    baseURL?: string,

    url: string

    pageName?: string

    pageUrl?: string

    userAgent?: Navigator['userAgent']

    method?: Method
}

type ClickEvent = (trackPlushConfig: TrackPlushConfig) => void

declare const clickEvent: ClickEvent

type BrowseEvent = (trackPlushConfig: TrackPlushConfig) => void

declare const browseEvent: BrowseEvent

export {
    ClickEvent,
    BrowseEvent,
    clickEvent,
    browseEvent
}

export default {
    install(Vue: typeof _Vue, options: TrackPlushConfig): void
}