import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { useSettingsStore, SCRUB_DEFAULTS, PROXY_DEFAULTS } from '../stores/useSettingsStore';

interface SliderFieldProps {
  label: string;
  value: number;
  displayValue: string;
  min: number;
  max: number;
  step: number;
  lowLabel: string;
  highLabel: string;
  defaultValue: number;
  description?: string;
  onChange: (value: number) => void;
}

function SliderField({
  label, value, displayValue, min, max, step,
  lowLabel, highLabel, defaultValue, description, onChange,
}: SliderFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm">{label}</label>
        <span className="font-mono text-sm text-muted-foreground">{displayValue}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-yellow-400 cursor-pointer"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{lowLabel}</span>
        <span className="text-muted-foreground/50">default: {defaultValue}</span>
        <span>{highLabel}</span>
      </div>
      {description && (
        <p className="text-xs text-muted-foreground/70 leading-relaxed">{description}</p>
      )}
    </div>
  );
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: Props) {
  const { scrub, setScrub, resetScrub, proxy, setProxy, resetProxy } = useSettingsStore();

  const secondsPerNotch = (scrub.sensitivity * scrub.maxDeltaPerEvent).toFixed(2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[460px] max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-1">
          <section className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Scroll Scrubbing
            </h3>

            <SliderField
              label="Scroll Speed"
              value={scrub.sensitivity}
              displayValue={`~${secondsPerNotch}s per notch`}
              min={0.001}
              max={0.05}
              step={0.001}
              lowLabel="Slow"
              highLabel="Fast"
              defaultValue={SCRUB_DEFAULTS.sensitivity}
              onChange={(v) => setScrub({ sensitivity: v })}
            />

            <SliderField
              label="Scroll Smoothing"
              value={scrub.maxDeltaPerEvent}
              displayValue={`${scrub.maxDeltaPerEvent}px cap`}
              min={5}
              max={150}
              step={5}
              lowLabel="Smooth"
              highLabel="Responsive"
              defaultValue={SCRUB_DEFAULTS.maxDeltaPerEvent}
              description="Lower values reduce jumpy behavior from mouse tilt wheels (Windows). Higher values give raw, unfiltered scroll input."
              onChange={(v) => setScrub({ maxDeltaPerEvent: v })}
            />

            <SliderField
              label="Speed Change Sensitivity"
              value={scrub.verticalScrollThreshold}
              displayValue={`${scrub.verticalScrollThreshold}px`}
              min={20}
              max={300}
              step={10}
              lowLabel="Touchy"
              highLabel="Steady"
              defaultValue={SCRUB_DEFAULTS.verticalScrollThreshold}
              description="Pixels of vertical scroll accumulated before stepping to the next playback speed. Lower values make speed changes more responsive; higher values prevent accidental changes."
              onChange={(v) => setScrub({ verticalScrollThreshold: v })}
            />
          </section>

          <section className="border-t border-border pt-4 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Proxy Generation
            </h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm">Enable Scrub Proxy</label>
                <p className="text-xs text-muted-foreground/70 leading-relaxed">
                  Generates a seek-optimized video for smooth scrubbing. Disable to use the original file directly.
                </p>
              </div>
              <button
                role="switch"
                aria-checked={proxy.enabled}
                onClick={() => setProxy({ enabled: !proxy.enabled })}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  proxy.enabled ? 'bg-yellow-400' : 'bg-muted'
                }`}
              >
                <span
                  className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                    proxy.enabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {proxy.enabled && (
              <SliderField
                label="Frames per Keyframe"
                value={proxy.keyframeInterval}
                displayValue={`${proxy.keyframeInterval}f\u00a0·\u00a0~${(proxy.keyframeInterval / 30).toFixed(1)}s seek`}
                min={1}
                max={300}
                step={1}
                lowLabel="Precise (slow encode)"
                highLabel="Fast (coarse seeks)"
                defaultValue={PROXY_DEFAULTS.keyframeInterval}
                description="Lower = more keyframes, smoother scrubbing, slower to generate. Changes apply to new videos only — delete the proxy file to regenerate an existing one."
                onChange={(v) => setProxy({ keyframeInterval: v })}
              />
            )}
          </section>
        </div>

        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={() => { resetScrub(); resetProxy(); }}>
            Reset to defaults
          </Button>
          <Button size="sm" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
