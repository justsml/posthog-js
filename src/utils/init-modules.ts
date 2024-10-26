import type { PostHogConfig } from '../types.js'

/**
 * Dynamically load modules based on configuration.
 *
 * Safe to run as config changes... dynamic imports are cached.
 *
 */
export const loadModules = async (config: Partial<PostHogConfig>) => {
    const nope = Boolean(config?.disable_external_dependency_loading)

    const surveysEnabled = Boolean(config?.disable_surveys !== true)
    const toolbarEnabled = config?.advanced_disable_toolbar_metrics !== true
    const heatmapsEnabled = config?.enable_heatmaps !== false || config?.capture_heatmaps
    const recording = Boolean(config?.session_recording)
    const webVitals = typeof config?.capture_performance === 'object' && config?.capture_performance?.web_vitals
    const webExperiments = config.disable_web_experiments !== true
    const featureFlags = config?.advanced_disable_feature_flags !== true || undefined

    return {
        Toolbar: !nope && toolbarEnabled ? (await import('../extensions/toolbar.js')).Toolbar : undefined,
        Heatmaps: !nope && heatmapsEnabled ? (await import('../heatmaps.js')).Heatmaps : undefined,
        WebExperiments: !nope && webExperiments ? (await import('../web-experiments.js')).WebExperiments : undefined,
        PostHogSurveys: !nope && surveysEnabled ? (await import('../posthog-surveys.js')).PostHogSurveys : undefined,
        PostHogFeatureFlags:
            !nope && featureFlags ? (await import('../posthog-featureflags.js')).PostHogFeatureFlags : undefined,
        WebVitalsAutocapture:
            !nope && webVitals ? (await import('../extensions/web-vitals/index.js')).WebVitalsAutocapture : undefined,
        SessionRecording:
            !nope && recording
                ? (await import('../extensions/replay/sessionrecording.js')).SessionRecording
                : undefined,
    }
}
