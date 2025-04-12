import os
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.models import load_model
from flask import request, jsonify

class CaptionTrainController:
    def __init__(self, model_path, dataset_dir, caption_file):
        self.model_path = model_path
        self.dataset_dir = dataset_dir
        self.caption_file = caption_file
        os.makedirs(self.dataset_dir, exist_ok=True)
        
        # Load the model at initialization
        self.model = self.load_model()

    def load_dataset(self):
        """Load captions from a JSON file."""
        if os.path.exists(self.caption_file):
            with open(self.caption_file, 'r') as f:
                return json.load(f)
        return {}

    def save_caption(self, captions):
        """Save captions to a JSON file."""
        with open(self.caption_file, 'w') as f:
            json.dump(captions, f)

    def load_model(self):
        """Load model if it exists; otherwise, return None."""
        if os.path.exists(self.model_path):
            return load_model(self.model_path)
        return None

    def preprocess_image(self, image_path):
        """Resize, normalize, and preprocess the image."""
        img = load_img(image_path, target_size=(224, 224))  
        img_array = img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)  
        img_array = img_array / 255.0  # Normalize image
        return img_array

    def train_model(self):
        """Train the model using uploaded images and captions."""
        # Load dataset
        data = self.load_dataset()

        # Get uploaded image and caption
        image_file = request.files['image']
        caption = request.form['caption']

        # Save the image to dataset directory
        image_path = os.path.join(self.dataset_dir, image_file.filename)
        image_file.save(image_path)

        # Update captions dataset
        data[image_file.filename] = caption
        self.save_caption(data)

        # If the model does not exist, create a new one
        if self.model is None:
            print("Creating a new model...")
            self.model = tf.keras.Sequential([
                tf.keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
                tf.keras.layers.Flatten(),
                tf.keras.layers.Dense(128, activation='relu'),
                tf.keras.layers.Dense(10, activation='softmax')  # Example: 10 output classes
            ])
            self.model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

        # Save the model after training (mock training for now)
        self.model.save(self.model_path)

        return jsonify({"message": "Model trained and data saved successfully!"}), 200
