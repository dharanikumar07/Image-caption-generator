import os
from flask import Flask
from flask_cors import CORS
import tensorflow as tf
from app.controllers.CaptionGeneratorController import CaptionGeneratorController
from app.controllers.CaptionTrainController import CaptionTrainController
from app.controllers.CaptionTranslateController import CaptionTranslateController
from app.controllers.CaptionSpeakController import CaptionSpeakController
from app.controllers.UserController import UserController

app = Flask(__name__, template_folder="resources/templates")
CORS(app) 

# File Paths
DATASET_DIR = 'datasets'
MODEL_FILE = 'model.h5'
CAPTION_JSON = 'datasets/captions.json'

#load the model
model = None
if os.path.exists(MODEL_FILE):
    model = tf.keras.models.load_model(MODEL_FILE)

# Initialize Controllers
caption_controller = CaptionGeneratorController(model, DATASET_DIR, CAPTION_JSON)
caption_train_controller = CaptionTrainController(MODEL_FILE, DATASET_DIR, CAPTION_JSON)
caption_translate_controller = CaptionTranslateController()
caption_speak_controller = CaptionSpeakController()
user_controller = UserController()

# Routes
app.add_url_rule('/generate_caption', 'generate_caption', caption_controller.generate_caption, methods=['POST'])
app.add_url_rule('/train', 'train_model', caption_train_controller.train_model, methods=['POST'])
app.add_url_rule('/translate', 'translate_caption', caption_translate_controller.translate_caption, methods=['POST'])
app.add_url_rule('/speak_caption', 'speak_caption', caption_speak_controller.speak_caption, methods=['POST'])

# User Authentication Routes
app.add_url_rule('/register', 'register', user_controller.register, methods=['POST'])
app.add_url_rule('/login', 'login', user_controller.login, methods=['POST'])
app.add_url_rule('/forgot_password', 'forgot_password', user_controller.forgot_password, methods=['POST'])
app.add_url_rule('/me', 'get_user_by_token',user_controller.get_user_by_token, methods=['GET'])
app.add_url_rule('/savesettings', 'save_user_settings',user_controller.save_user_settings, methods=['POST'])
app.add_url_rule('/getsettings', 'get_user_settings',user_controller.get_user_settings, methods=['GET'])
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


#[notice] A new release of pip is available: 24.3.1 -> 25.0.1