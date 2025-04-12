import threading
import os
import uuid
from flask import request, jsonify
from gtts import gTTS
import pygame

class CaptionSpeakController:
    def speak_caption(self):
        data = request.get_json()
        caption = data.get("caption", "")

        if not caption:
            return jsonify({"error": "No caption provided."}), 400

        threading.Thread(target=self._speak, args=(caption,)).start()
        return jsonify({"message": "Caption is being spoken!"}), 200

    def _speak(self, caption):
        try:
            # Generate unique MP3 file
            filename = f"temp_{uuid.uuid4()}.mp3"
            tts = gTTS(text=caption, lang='ta')
            tts.save(filename)

            # Initialize and play with pygame
            pygame.init()
            pygame.mixer.init()
            pygame.mixer.music.load(filename)
            pygame.mixer.music.play()

            # Wait until audio is done playing
            while pygame.mixer.music.get_busy():
                pygame.time.Clock().tick(10)

            # Cleanup
            pygame.mixer.quit()
            os.remove(filename)

        except Exception as e:
            print("❌ Error in speaking:", e)
            try:
                if os.path.exists(filename):
                    os.remove(filename)
            except:
                pass
