from flask import request, jsonify
from deep_translator import GoogleTranslator

class CaptionTranslateController:
    def translate_caption(self):
        data = request.get_json()
        caption = data.get("caption", "")
        target_lang = data.get("lang", "en")

        if not caption:
            return jsonify({"error": "No caption provided."}), 400

        try:
            translated_text = GoogleTranslator(target=target_lang).translate(caption)
            return jsonify({"translated_caption": translated_text}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
