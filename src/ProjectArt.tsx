interface Props {
  index: number;
  name: string;
}

// Original, lightweight cover art rather than borrowed project screenshots.
export default function ProjectArt({ index, name }: Props) {
  return (
    <div className={`project-art art-${index}`} aria-hidden="true">
      <div className="art-grid" />
      <span className="art-coordinate">NR / EXPERIMENT 0{index + 1}</span>
      {index === 0 ? (
        <div className="sticker-composition">
          <span>✦</span>
          <span>♜</span>
          <span>♛</span>
          <span>✧</span>
        </div>
      ) : index === 1 ? (
        <div className="system-composition">
          <div>API</div>
          <i />
          <div>DATA</div>
          <i />
          <div>CLOUD</div>
        </div>
      ) : index === 2 ? (
        <div className="wave-composition">
          <i />
          <i />
          <i />
          <span>W / W</span>
        </div>
      ) : index === 3 ? (
        <div className="zzz-composition">
          <span>Z</span>
          <span>Z</span>
          <span>Z</span>
        </div>
      ) : index === 4 ? (
        <div className="physics-composition">
          <i />
          <i />
          <i />
          <span>F = ma</span>
        </div>
      ) : (
        <div className="dna-composition">
          <span>✳</span>
          <strong>
            EVOLVED
            <br />
            DNA
          </strong>
          <small>PRIVACY, BY DESIGN.</small>
        </div>
      )}
      <span className="art-name">{name}</span>
      <span className="art-cross">+</span>
    </div>
  );
}
