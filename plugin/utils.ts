import type { TrackElement, TrackParams } from './type';

export const getRuntimeInfo = (pageUrl?: string, userAgent?: string) => ({
  userAgent: userAgent || window.navigator.userAgent,
  pageUrl: pageUrl || window.location.href,
});

export const normalizeTrackParams = (trackParams: TrackParams, stringKey: string) => {
  if (typeof trackParams === 'string') {
    return {
      [stringKey]: trackParams,
    };
  }

  return trackParams && typeof trackParams === 'object' ? trackParams : {};
};

export const stringifyTrackParams = (trackParams: TrackParams) => {
  if (typeof trackParams === 'string') return trackParams;

  try {
    return JSON.stringify(trackParams || '');
  } catch (error) {
    return '';
  }
};

export const resolveTrackParams = (el: TrackElement, vnode?: Vue.VNode) => {
  if (el.__vtpTrackParams !== undefined) return el.__vtpTrackParams;

  const attrs = vnode?.data?.attrs || {};
  return attrs['track-params'] !== undefined
    ? (attrs['track-params'] as TrackParams)
    : el.getAttribute('track-params') || undefined;
};
