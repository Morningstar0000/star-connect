// // src/pages/TestCallPage.jsx
// import { useEffect, useRef } from 'react';
// import DailyIframe from '@daily-co/daily-js';

// const TestCallPage = () => {
//   const frameRef = useRef(null);
//   const containerRef = useRef(null);

//   useEffect(() => {
//     // Use a test room URL from Daily.co dashboard
//     const testRoomUrl = 'https://star-connect.daily.co/starconnect-SC216442-1774343000016';
    
//     const frame = DailyIframe.createFrame(containerRef.current, {
//       showLeaveButton: true,
//       iframeStyle: {
//         width: '100%',
//         height: '100vh',
//         border: '0',
//       },
//     });
    
//     frameRef.current = frame;
    
//     frame.on('joined-meeting', () => {
//       console.log('Joined!');
//     });
    
//     frame.on('error', (e) => {
//       console.error('Error:', e);
//     });
    
//     frame.join({ url: testRoomUrl });
    
//     return () => {
//       frame.destroy();
//     };
//   }, []);
  
//   return (
//     <div>
//       <h1>Test Video Call</h1>
//       <div ref={containerRef} />
//     </div>
//   );
// };

// export default TestCallPage;