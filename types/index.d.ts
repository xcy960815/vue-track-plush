
import { Method } from "axios"
import Vue from "vue"

type TrackPlushConfig = {
    projectName?: string,
    baseURL: string,
    url: string
    pageName?: string
    pageUrl?: string
    userAgent?: Navigator['userAgent']
    method?: Method
}

type ClickEvent = (trackPlushConfig: TrackPlushConfig) => void

type BrowseEvent = (trackPlushConfig: TrackPlushConfig) => void

type Install = (vue: Vue, trackPlushConfig: TrackPlushConfig) => void

declare const clickEvent: ClickEvent
declare const browseEvent: BrowseEvent
declare const install: Install

export { TrackPlushConfig, clickEvent, browseEvent, install }




