import os
import json
import numpy as np
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from flask import request, jsonify

class CaptionGeneratorController:
    def __init__(self, model, dataset_dir, caption_file):
        self.model = model
        self.dataset_dir = dataset_dir
        self.caption_file = caption_file
        os.makedirs(self.dataset_dir, exist_ok=True)

    def load_dataset(self):
        if os.path.exists(self.caption_file):
            with open(self.caption_file, 'r') as f:
                return json.load(f)
        return {}

    def preprocess_image(self, image_path):
        img = load_img(image_path, target_size=(224, 224))
        img_array = img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        return img_array

    def generate_caption(self):
        if self.model is None:
            return jsonify({"error": "Model not loaded."}), 500

        image_file = request.files['image']
        image_path = os.path.join(self.dataset_dir, image_file.filename)
        image_file.save(image_path)

        img_array = self.preprocess_image(image_path)
        prediction = self.model.predict(img_array)

        data = self.load_dataset()
        caption = data.get(image_file.filename, "No caption found.")

        return jsonify({"caption": caption}), 200
