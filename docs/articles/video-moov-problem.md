---
title: IOS devices can't play the video, occur moov atom not found error
description: Once PM tell me the video can't be played in ios devices, but it can be played in android devices. And I check network, every time the video request is failed
tags: web
---


# IOS devices can't play the video, occur moov atom not found error
Once PM tell me the video can't be played in ios devices, but it can be played in android devices. And I check network, every time the video request is failed

## Reason
The video encode have something wrong, because ios devices inspect the video format will check the `moov atom` at the frontend of the video, but some video maker will put the `moov atom` at the end of the video, so the ios devices can't play the video. 


## How to resolve this problem
1. Use GUI tools to transcode the video, like [HandBrake](https://handbrake.fr/), and check the `Web Optimized` option, it will put the `moov atom` at the frontend of the video.
2. Use command line tools to transcode the video, like [ffmpeg](https://ffmpeg.org/), and add the `-movflags faststart` option, it will put the `moov atom` at the frontend of the video.

```bash
$ ffmpeg -i ./input.mp4 -c:v copy -movflags faststart -strict -2 ./output.mp4
```

3. Use the [mp4box](https://gpac.wp.imt.fr/mp4box/) to move the `moov atom` to the frontend of the video.

```bash
$ MP4Box -add in.mp4 out.mp4
```

## How to check format in the frontend
* CDN website: https://www.jsdelivr.com/package/npm/mp4box

```
$ npm install mp4box
```

* Check the video format
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script src="https://cdn.jsdelivr.net/npm/mp4box@0.5.2/dist/mp4box.all.min.js"></script>
</head>

<body>
  <input type="file" id="upload">
</body>
<script>
  let fileInput = document.querySelector('#upload');
  fileInput.addEventListener('change', function (event) {
    let file = event.target.files[0];
    if (file) {
      let reader = new FileReader();
      reader.onload = function (event) {
        let arrayBuffer = event.target.result;
        processMP4(arrayBuffer);
      };
      reader.readAsArrayBuffer(file);
    }
  });

  function processMP4(arrayBuffer) {
    let mp4boxInstance = MP4Box.createFile();
    mp4boxInstance.onError = function (e) {
      console.error("MP4Box encountered an error:", e);
    };

    mp4boxInstance.onReady = function (info) {
      if (info.isProgressive === false) {
        alert('moov atom not found at the start of the file.');
      } else {
        alert('moov atom found at the start. All good!');
      }
    };

    mp4boxInstance.onMoovStart = function () {
      console.log("Starting to receive File Information");
    }

    arrayBuffer.fileStart = 0;

    mp4boxInstance.appendBuffer(arrayBuffer);
    mp4boxInstance.flush();
  }
</script>

</html>
```


## Reference
1. https://github.com/gpac/mp4box.js/issues/235
2. https://github.com/gpac/mp4box.js
3. https://superuser.com/questions/606653/ffmpeg-converting-media-type-aswell-as-relocating-moov-atom
4. https://stackoverflow.com/questions/18103103/failed-to-load-resource-plugin-handled-load-on-ios