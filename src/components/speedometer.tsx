
import { JSX } from 'react';
import { useState } from 'react';

export default function Speedometer(props: {
  value: number;
  min: number;
  max: number;
  unit: string;
  animate?: boolean;
//no burn value means no burn or coast indicator
//burn true means burn indicator; burn false means coast indicator
  // burn?: boolean; 
}): JSX.Element {
  const [lSegments , setLSegments] = useState({
    l0: '--color-gray', l1: '--color-gray', l2: '--color-gray', l3: '--color-gray', l4: '--color-gray',
    l5: '--color-gray', l6: '--color-gray', l7: '--color-gray', l8: '--color-gray', l9: '--color-gray',
  });
  const [rSegments , setRSegments] = useState({
    r0: '--color-gray', r1: '--color-gray', r2: '--color-gray', r3: '--color-gray', r4: '--color-gray',
    r5: '--color-gray', r6: '--color-gray', r7: '--color-gray', r8: '--color-gray', r9: '--color-gray',
  });

  const [isAnimating, setIsAnimating] = useState(false);
  const [burn, setBurn] = useState<boolean | undefined>(undefined);


  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  //animation for demo purposes
  const animateSegments = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    //burn countdown
    for (let i = 9; i >= 0; i--) {
      setLSegments(prev => ({ ...prev, [`l${i}`]: '--color-green-highlight' }));
      setRSegments(prev => ({ ...prev, [`r${i}`]: '--color-green-highlight' }));
      await sleep(500);
    }
    //burn now
    setBurn(true);
    await sleep(5000);
    setBurn(undefined);

    //coast countdown
    for (let i = 0; i <= 9; i++) {
      setLSegments(prev => ({ ...prev, [`l${i}`]: '--color-alert' }));
      setRSegments(prev => ({ ...prev, [`r${i}`]: '--color-alert' }));
      await sleep(500);
    }
    setBurn(false);
    await sleep(5000);
    setLSegments({
      l0: '--color-gray', l1: '--color-gray', l2: '--color-gray', l3: '--color-gray', l4: '--color-gray',
      l5: '--color-gray', l6: '--color-gray', l7: '--color-gray', l8: '--color-gray', l9: '--color-gray'
    });
    setRSegments({
      r0: '--color-gray', r1: '--color-gray', r2: '--color-gray', r3: '--color-gray', r4: '--color-gray',
      r5: '--color-gray', r6: '--color-gray', r7: '--color-gray', r8: '--color-gray', r9: '--color-gray'
    });
    setBurn(undefined);
    setIsAnimating(false);
  };

  const ringStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    position: 'relative',
    background: `conic-gradient(
      from 0deg,
      transparent 0deg 45deg,
      ${`var(${rSegments.r0})`} 45deg 50deg,
      transparent 50deg 54deg,
      ${`var(${rSegments.r1})`} 54deg 59deg,
      transparent 59deg 63deg,
      ${`var(${rSegments.r2})`} 63deg 68deg,
      transparent 68deg 72deg,
      ${`var(${rSegments.r3})`} 72deg 77deg,
      transparent 77deg 81deg,
      ${`var(${rSegments.r4})`} 81deg 86deg,
      transparent 86deg 90deg,
      ${`var(${rSegments.r5})`} 90deg 95deg,
      transparent 95deg 99deg,
      ${`var(${rSegments.r6})`} 99deg 104deg,
      transparent 104deg 108deg,
      ${`var(${rSegments.r7})`} 108deg 113deg,
      transparent 113deg 117deg,
      ${`var(${rSegments.r8})`} 117deg 122deg,
      transparent 122deg 126deg,
      ${`var(${rSegments.r9})`} 126deg 131deg,
      transparent 131deg 225deg,
      ${`var(${lSegments.l9})`} 225deg 230deg,
      transparent 230deg 234deg,
      ${`var(${lSegments.l8})`} 234deg 239deg,
      transparent 239deg 243deg,
      ${`var(${lSegments.l7})`} 243deg 248deg,
      transparent 248deg 252deg,
      ${`var(${lSegments.l6})`} 252deg 257deg,
      transparent 257deg 261deg,
      ${`var(${lSegments.l5})`} 261deg 266deg,
      transparent 266deg 270deg,
      ${`var(${lSegments.l4})`} 270deg 275deg,
      transparent 275deg 279deg,
      ${`var(${lSegments.l3})`} 279deg 284deg,
      transparent 284deg 288deg,
      ${`var(${lSegments.l2})`} 288deg 293deg,
      transparent 293deg 297deg,
      ${`var(${lSegments.l1})`} 297deg 302deg,
      transparent 302deg 306deg,
      ${`var(${lSegments.l0})`} 306deg 311deg,
      transparent 311deg 360deg
    )`,
    WebkitMaskImage: 
    `radial-gradient(
          circle,
          transparent calc(450px / 2 - 30px),
          black calc(450px / 2 - 30px)
      ),
      conic-gradient(
          transparent 0deg 45deg,
          black 45deg 135deg,
          transparent 135deg 225deg,
          black 225deg 315deg,
          transparent 315deg
      )`,
    WebkitMaskComposite: 'source-in',
    maskComposite: 'intersect',
  } as React.CSSProperties;

  const burnRingStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    position: 'relative',
    background: 'var(--color-green-highlight)',
    WebkitMaskImage: `radial-gradient(
      circle,
      transparent calc(450px / 2 - 30px),
      black calc(450px / 2 - 30px)
      ),
      conic-gradient(
        transparent 0deg 45deg,
        black 45deg 135deg,
        transparent 135deg 225deg,
        black 225deg 315deg,
        transparent 315deg
      )`,
    WebkitMaskComposite: 'source-in',
    maskComposite: 'intersect',
  } as React.CSSProperties;

  const coastRingStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    position: 'relative',
    background: 'var(--color-alert)',
    WebkitMaskImage: `radial-gradient(
      circle,
      transparent calc(450px / 2 - 30px),
      black calc(450px / 2 - 30px)
      ),
      conic-gradient(
        transparent 0deg 45deg,
        black 45deg 135deg,
        transparent 135deg 225deg,
        black 225deg 315deg,
        transparent 315deg
      )`,
    WebkitMaskComposite: 'source-in',
    maskComposite: 'intersect',
  } as React.CSSProperties;

  return (
    <div className="wrap">
      < div style = {burn === undefined ? ringStyle : burn ? burnRingStyle : coastRingStyle}></div>
      <div className="speed-center" onClick={animateSegments}>
        <div 
          className="speed-value" 
          style={{ opacity: props.burn !== undefined ? 0.7 : 1 }}
        >
          {Math.round(props.value)}
        </div>
        <div 
          className="gauge-unit" 
          style={{ opacity: props.burn !== undefined ? 0.7 : 1 }}
        >
          {props.unit}
        </div>
        {
          burn !== undefined && 
            <div className={burn ? 'engine-on': 'engine-off'}>
              {burn ? 'ENGINE ON' : 'ENGINE OFF'}
            </div>
        }
      </div>
    </div>
  );
}
