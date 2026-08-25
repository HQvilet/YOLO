import type { Socket } from "socket.io-client";

export default function createPeerConnection({userId: targetUserId, socket}: {userId: string, socket: Socket}) {
  const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

//   // 1. Thêm các track local (cam/mic) vào kết nối
//   localStream.getTracks().forEach((track) => {
//     pc.addTrack(track, localStream);
//   });

  // 2. Khi tìm thấy ICE Candidate -> gửi riêng cho targetUserId
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('send-ice-candidate', {
        targetUserId,
        candidate: event.candidate,
      });
    }
  };

  // 3. Khi nhận được luồng Video/Audio từ peer này -> Cập nhật lên UI
  pc.ontrack = (event) => {
    // addRemoteStreamToUI(targetUserId, event.streams[0]);
  };

  return pc;
}
