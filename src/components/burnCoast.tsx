/* eslint-disable linebreak-style */
import { JSX } from 'react';

export default function BurnCoast(): JSX.Element {
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{display: 'flex', flexDirection: 'row'}}> {/* first row */ }
          <div className="lap-single">
            <div className="actual-done" style={{width: '28%'}}></div>
            <div className="actual-burn" style={{width: '7%'}}></div>
            <div className="actual-done" style={{width: '24%'}}></div>
          </div>
          <div style={{backgroundColor: 'white'}}></div>
        </div>
        <div style={{display: 'flex', flexDirection: 'row'}}> {/* second row */ }
          <div className="lap-single">
            <div className="simulated-done" style={{width: '30%'}}></div>
            <div className="simulated-burn" style={{width: '5%'}}></div>
            <div className="simulated-done" style={{width: '20%'}}></div>
          </div>
          <div></div>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', marginTop: '0.5em'}}> {/* third row, full race actual */ }
          <div className="lap-double">
            <div className="actual-done" style={{width: '90%'}}></div>
            <div className="actual-burn" style={{width: '10%'}}></div>
          </div>
          <div className="lap-double">
            <div className="actual-burn" style={{width: '7%'}}></div>
            <div className="actual-done" style={{width: '93%'}}></div>
          </div>
          <div className="lap-double">
            <div className="actual-done" style={{width: '20%'}}></div>
            <div className="actual-burn" style={{width: '10%'}}></div>
            <div className="actual-done" style={{width: '40%'}}></div>
          </div>
          <div className="lap-double"></div>
        </div>
      </div>
      
    </>
  );
}
