/* eslint-disable linebreak-style */
import { JSX } from 'react';

export default function BurnCoast(): JSX.Element {
  return (
    <>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <div className="lap">
          <div className="actual-done" style={{width: '90%'}}></div>
          <div className="actual-burn" style={{width: '10%'}}></div>
        </div>
        <div className="lap">
          <div className="actual-burn" style={{width: '7%'}}></div>
          <div className="actual-done" style={{width: '93%'}}></div>
        </div>
        <div className="lap">
          <div className="actual-done" style={{width: '20%'}}></div>
          <div className="actual-burn" style={{width: '10%'}}></div>
          <div className="actual-done" style={{width: '40%'}}></div>
        </div>
        <div className="lap"></div>
      </div> 
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <div className="lap">
          <div className="simulated-done" style={{width: '80%'}}></div>
          <div className="simulated-burn" style={{width: '20%'}}></div>
        </div>
        <div className="lap">
          <div className="simulated-burn" style={{width: '5%'}}></div>
          <div className="simulated-done" style={{width: '95%'}}></div>
        </div>
        <div className="lap">
          <div className="simulated-done" style={{width: '15%'}}></div>
          <div className="simulated-burn" style={{width: '15%'}}></div>
          <div className="simulated-done" style={{width: '47%'}}></div>
        </div>
        <div className="lap"></div>
      </div> 
    </>
  );
}
