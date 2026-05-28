import type { TrackElement, TrackParams } from './type';

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
