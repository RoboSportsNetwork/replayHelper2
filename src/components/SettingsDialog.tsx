import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { useSettingsStore, SCRUB_DEFAULTS } from '../stores/useSettingsStore';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: Props) {
  const { scrub, setScrub, resetScrub } = useSettingsStore();

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

            {/* Sensitivity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm">Scroll Speed</label>
                <span className="font-mono text-sm text-muted-foreground">
                  ~{secondsPerNotch}s per notch
                </span>
              </div>
              <input
                type="range"
                min={0.001}
                max={0.05}
                step={0.001}
                value={scrub.sensitivity}
                onChange={(e) => setScrub({ sensitivity: parseFloat(e.target.value) })}
                className="w-full accent-yellow-400 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Slow</span>
                <span className="text-muted-foreground/50">
                  default: {SCRUB_DEFAULTS.sensitivity}
                </span>
                <span>Fast</span>
              </div>
            </div>

            {/* Max delta per event */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm">Scroll Smoothing</label>
                <span className="font-mono text-sm text-muted-foreground">
                  {scrub.maxDeltaPerEvent}px cap
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={150}
                step={5}
                value={scrub.maxDeltaPerEvent}
                onChange={(e) => setScrub({ maxDeltaPerEvent: parseInt(e.target.value) })}
                className="w-full accent-yellow-400 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Smooth</span>
                <span className="text-muted-foreground/50">
                  default: {SCRUB_DEFAULTS.maxDeltaPerEvent}
                </span>
                <span>Responsive</span>
              </div>
              <p className="text-xs text-muted-foreground/70 leading-relaxed">
                Lower values reduce jumpy behavior from mouse tilt wheels (Windows). Higher
                values give raw, unfiltered scroll input.
              </p>
            </div>
          </section>
        </div>

        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={resetScrub}>
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
