import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WebcamSnapshotComponent } from "./webcam-snapshot.component";
import { WebcamModule } from "ngx-webcam";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CameraComponent } from "../camera/camera.component";


@NgModule({
  imports: [CommonModule,WebcamModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [WebcamSnapshotComponent, CameraComponent],
  exports: [WebcamSnapshotComponent]
})
export class WebcamSnapshotModule {}
