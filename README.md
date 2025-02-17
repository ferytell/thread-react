# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

That sounds like a custom photo upload component where:
✅ Users can upload up to 5 photos.
✅ Each uploaded photo shows as a thumbnail.
✅ Each photo has a caption input (text box).
✅ The upload box changes to the latest uploaded photo.
✅ Removing the photo clears the upload slot.


---

🛠 Custom Photo Upload Component

import React, { useState } from "react";
import { Upload, Button, Input } from "antd";
import { UploadOutlined, CloseCircleOutlined } from "@ant-design/icons";

interface UploadedPhoto {
  id: number;
  file: File;
  url: string;
  caption: string;
}

const PhotoUploader: React.FC = () => {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);

  // Handle photo upload
  const handleUpload = (file: File) => {
    if (photos.length >= 5) {
      alert("You can only upload up to 5 photos.");
      return false;
    }

    const newPhoto: UploadedPhoto = {
      id: Date.now(),
      file,
      url: URL.createObjectURL(file),
      caption: "",
    };

    setPhotos([...photos, newPhoto]);
    return false; // Prevent Ant Design from auto-uploading
  };

  // Handle caption change
  const handleCaptionChange = (id: number, value: string) => {
    setPhotos((prev) =>
      prev.map((photo) => (photo.id === id ? { ...photo, caption: value } : photo))
    );
  };

  // Handle photo removal
  const handleRemove = (id: number) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
  };

  return (
    <div className="space-y-4 p-4 border rounded-md">
      {/* Upload Box */}
      <Upload
        beforeUpload={handleUpload}
        showUploadList={false}
        accept="image/*"
      >
        <Button icon={<UploadOutlined />} disabled={photos.length >= 5}>
          Upload Photo ({photos.length}/5)
        </Button>
      </Upload>

      {/* Photo Previews */}
      <div className="grid grid-cols-5 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="relative border p-2 rounded-md">
            {/* Thumbnail */}
            <img
              src={photo.url}
              alt="uploaded"
              className="w-full h-20 object-cover rounded-md"
            />

            {/* Remove Button */}
            <CloseCircleOutlined
              className="absolute top-1 right-1 text-red-500 cursor-pointer"
              onClick={() => handleRemove(photo.id)}
            />

            {/* Caption Input */}
            <Input
              placeholder="Enter caption..."
              value={photo.caption}
              onChange={(e) => handleCaptionChange(photo.id, e.target.value)}
              className="mt-2"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoUploader;


---

🚀 Usage Example

import React from "react";
import PhotoUploader from "./PhotoUploader";

const App: React.FC = () => {
  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Upload Photos</h2>
      <PhotoUploader />
    </div>
  );
};

export default App;


---

✅ Features

Upload up to 5 photos only (prevents extra uploads).

Shows uploaded photos as thumbnails inside the upload box.

Allows adding captions per photo using a text input.

Removes a photo when clicking the delete icon.

Previews uploaded images using URL.createObjectURL().


Would you like to add drag-and-drop, reorder photos, or upload progress indicators? 🚀



=====================
export const postLoanInfos = async (payload: object) => {
  return api
    .post('/loan-infos', {
      payload: payload,
    })
    .then(({ data }) => {
      return {
        code: data.code,
        data: data.data || [],
        message: data.message,
      }
    })
    .catch(err => {
      return {
        code: err.code,
        data: [],
        message: err.data ? err.data.message : err.message,
      }
    })
}
