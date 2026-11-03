import type { QuantumMode } from './QuantumWorld';

interface Props {
  compact?: boolean;
  mode: QuantumMode;
  onMode: (mode: QuantumMode) => void;
  phase: number;
  onPhase: (phase: number) => void;
  onMeasure: () => void;
  counts: [number, number];
  shots: number;
  outcome: number | null;
}
const modes = [
  {
    id: 'electron',
    name: 'Electron',
    title: 'A possibility. Not a path.',
    text: 'The cloud represents where an electron may be detected. Each measurement gives one position; repeated preparations reveal a distribution, not a fixed orbit.',
  },
  {
    id: 'photon',
    name: 'Light',
    title: 'Waves interfere. Detections are discrete.',
    text: 'Two wave amplitudes overlap to create an interference pattern. Individual photon detections accumulate into bright and dark bands over repeated trials.',
  },
  {
    id: 'entangled',
    name: 'Entangle',
    title: 'One joint state. Correlated outcomes.',
    text: 'Prepare a Bell pair, then measure both qubits in the same basis: the outcomes agree, even though each individual result is random. This correlation cannot transmit a faster-than-light message.',
  },
  {
    id: 'qubit',
    name: 'Qubit',
    title: 'Shape the amplitudes. Change the odds.',
    text: 'A qubit is a quantum state, not a particular particle. Electrons, photons, trapped ions, and superconducting circuits can encode it. Gates change amplitudes; measurement samples an outcome.',
  },
] as const;

export default function QuantumLab({
  compact = false,
  mode,
  onMode,
  phase,
  onPhase,
  onMeasure,
  counts,
  shots,
  outcome,
}: Props) {
  const active = modes.find((item) => item.id === mode)!;
  const p0 = mode === 'entangled' ? 0.5 : Math.cos(phase / 2) ** 2;
  return (
    <div className={compact ? 'quantum-lab compact' : 'quantum-lab container'}>
      <div className="quantum-tabs" role="group" aria-label="Quantum visualization">
        {modes.map((item, index) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={mode === item.id}
            onClick={() => onMode(item.id)}
          >
            <small>0{index + 1}</small>
            {item.name}
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <div className="quantum-explanation">
        <p className="quantum-kicker">
          QUANTUM /{' '}
          {mode === 'electron'
            ? 'PROBABILITY DENSITY'
            : mode === 'photon'
              ? 'WAVE–PARTICLE DUALITY'
              : mode === 'entangled'
                ? 'ENTANGLEMENT & CORRELATION'
                : 'SUPERPOSITION & INTERFERENCE'}
        </p>
        <h2>{active.title}</h2>
        <p>{active.text}</p>
      </div>
      <div className="quantum-instrument">
        {mode === 'qubit' && (
          <>
            <label htmlFor="quantum-phase">
              Relative phase <span>{(phase / Math.PI).toFixed(2)}π</span>
            </label>
            <input
              id="quantum-phase"
              type="range"
              min="0"
              max="2"
              step="0.01"
              value={phase / Math.PI}
              onChange={(event) => onPhase(Number(event.target.value) * Math.PI)}
            />
            <div className="qubit-circuit" aria-label="Hadamard, phase, Hadamard, measurement">
              |0⟩ — H — Rz(φ) — H — M
            </div>
            <div className="probability-row">
              <span>|0⟩ {Math.round(p0 * 100)}%</span>
              <div>
                <i style={{ width: `${p0 * 100}%` }} />
              </div>
              <span>|1⟩ {Math.round((1 - p0) * 100)}%</span>
            </div>
            <p className="measurement-counts">
              Measured: {counts[0]} zeros / {counts[1]} ones
            </p>
          </>
        )}
        {mode === 'entangled' && (
          <>
            <div className="qubit-circuit">|Φ⁺⟩ = (|00⟩ + |11⟩) / √2</div>
            <div className="probability-row">
              <span>|00⟩ 50%</span>
              <div>
                <i style={{ width: '50%' }} />
              </div>
              <span>|11⟩ 50%</span>
            </div>
            <p className="measurement-counts">
              Correlated pairs: {counts[0]} × 00 / {counts[1]} × 11
            </p>
          </>
        )}
        <button type="button" className="measure-button" onClick={onMeasure}>
          Measure{' '}
          {mode === 'photon'
            ? 'a photon'
            : mode === 'electron'
              ? 'position'
              : mode === 'entangled'
                ? 'pair'
                : 'qubit'}{' '}
          <span aria-hidden="true">↗</span>
        </button>
        <p className="measurement-result" aria-live="polite">
          {shots === 0
            ? 'One measurement. One outcome.'
            : mode === 'entangled'
              ? `Trial ${shots} → |${outcome}${outcome}⟩ · preparing again`
              : mode === 'qubit'
                ? `Trial ${shots} → |${outcome}⟩ · preparing again`
                : `Detection ${shots} · preparing a fresh state`}
        </p>
      </div>
      <details className="quantum-notes">
        <summary>Behind the visual</summary>
        <p>
          These are conceptual illustrations, not a physical simulation. The electron cloud is a
          stylized p-like density; its dots represent possible outcomes, not many electrons or
          trajectories. The translucent surface is an artistic wave motif. The light view uses an
          idealized two-source pattern. The qubit shows H → Rz(φ) → H, with P(0) = cos²(φ/2) and
          P(1) = sin²(φ/2). Phase interference changes the probabilities; sampling probabilities
          alone is not quantum computing.
        </p>
        <p>
          The entangled view samples an ideal Bell pair in a shared basis: only 00 or 11 occur, each
          with probability ½. It illustrates joint-state correlations, not communication between the
          qubits. Measurement flashes fade as a new state is prepared.{' '}
          <a href="https://quantum.cloud.ibm.com/learning/en/courses/utility-scale-quantum-computing/bits-gates-and-circuits">
            Learn about qubits, gates, and measurement ↗
          </a>
        </p>
      </details>
    </div>
  );
}
