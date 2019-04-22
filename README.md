# DicomViewer

Simple DicomViewer build on cornerstoneTools JS.

```js
import Vue from 'vue'
import Lightbox from './src/Viewer'

Vue.component("dicom-viewer", Lightbox);

var images = {
   "rmlo":{
      "type_name":"rmlo",
      "url":"http:\/\/site.com\/image\/54ae7360-f17d-46db-9823-c5fda23fa1f1.jpg",
      "thumb_url":"http:\/\/site.com\/images\/thumb\/54ae7360-f17d-46db-9823-c5fda23fa1f1.jpg"
   },
   "lmlo":{
      "type_name":"lmlo",
      "url":"http:\/\/site.com\/image\/dc155e58-13ae-42d9-970f-1c12884dbf77.jpg",
      "thumb_url":"http:\/\/site.com\/images\/thumb\/dc155e58-13ae-42d9-970f-1c12884dbf77.jpg"
   },
   "rcc":{
      "type_name":"rcc",
      "url":"http:\/\/site.com\/image\/dfc58425-4f6d-4c83-8d13-10f9c4692b13.jpg",
      "thumb_url":"http:\/\/site.com\/images\/thumb\/dfc58425-4f6d-4c83-8d13-10f9c4692b13.jpg"
   },
   "lcc":{
      "type_name":"lcc",
      "url":"http:\/\/site.com\/image\/a0d5232b-698c-4884-be26-62f19c585b03.jpg",
      "thumb_url":"http:\/\/site.com\/images\/thumb\/image\/a0d5232b-698c-4884-be26-62f19c585b03.jpg"
   }
}
```

```html
<dicom-viewer :images="images"></dicom-viewer>
```
