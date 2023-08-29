import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-video-capture',
  templateUrl: './video-capture.component.html',
  styleUrls: ['./video-capture.component.css']
})
export class VideoCaptureComponent implements OnInit {
  @ViewChild('videoElement') videoElement: ElementRef;
  videoStream: MediaStream | undefined;
  mediaRecorder: MediaRecorder | undefined;
  recordedChunks: Blob[] = [];
  isRecording = false;

  constructor() {}

  async ngOnInit() {
    try {
      this.videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      this.videoElement.nativeElement.srcObject = this.videoStream;
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  }

  startRecording() {
    this.recordedChunks = [];
    this.isRecording = true;

    const mediaStream = this.videoStream;
    if (!mediaStream) {
      console.error('Video stream not available');
      return;
    }

    this.mediaRecorder = new MediaRecorder(mediaStream);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      this.isRecording = false;
      const recordedBlob = new Blob(this.recordedChunks, { type: 'video/webm' });
      // You can store the recordedBlob in a variable or send it to an endpoint.
      console.log('Recording complete. Sending to endpoint...');
      this.sendToEndpoint(recordedBlob);
    };

    this.mediaRecorder.start();
    setTimeout(() => {
      this.stopRecording();
    }, 30000); // Stop recording after 30 seconds
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }
                     
  sendToEndpoint(recordedData: Blob) {
    // Implement the code to send the recorded video to your desired endpoint.
    // Example: Use HttpClient to make a POST request to your server.
    // You may need to adjust this part according to your server's API.
    console.log('Sending data to the endpoint...');
    // Here, you can make an HTTP request to send the recordedData to your server.
  }
}

