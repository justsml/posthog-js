import type { PostHogConfig } from '../types.js'

/**
 * Dynamically load modules based on configuration
 */
export const initModules = async (config: PostHogConfig) => {
    const nope = Boolean(config.disable_external_dependency_loading)

    const surveysEnabled = Boolean(config?.disable_surveys)
    const heatmapsEnabled = config?.enable_heatmaps !== false || config?.capture_heatmaps
    const recordingEnabled = Boolean(config?.session_recording)
    const webVitalsEnabled = typeof config?.capture_performance === 'object' && config?.capture_performance?.web_vitals
    const webExperimentsEnabled = config.disable_web_experiments !== true

    return {
        Surveys: !nope && surveysEnabled && (await import('../posthog-surveys.js')).PostHogSurveys,
        Heatmaps: !nope && heatmapsEnabled && (await import('../heatmaps.js')).Heatmaps,
        WebExperiments: !nope && webExperimentsEnabled && (await import('../web-experiments.js')).WebExperiments,
        WebVitalsAutocapture:
            !nope && webVitalsEnabled && (await import('../extensions/web-vitals/index.js')).WebVitalsAutocapture,
        SessionRecording:
            !nope && recordingEnabled && (await import('../extensions/replay/sessionrecording.js')).SessionRecording,
    }
}
