# api/fetch_gif.py
from flask import Flask, request, send_file
import requests
import os
import re

app = Flask(__name__)

chinese_char_regex = re.compile(r'[\u4e00-\u9fff]')

@app.route('/fetch_gif', methods=['GET'])
def fetch_gif():
    character = request.args.get('char')
    if not chinese_char_regex.match(character):
        return "Invalid character", 400

    gif_dir = '/tmp'  # 使用临时目录
    gif_path = os.path.join(gif_dir, f"{character}.gif")
    
    if not os.path.exists(gif_path):
        # 假设存在一个公开的API或URL可以直接获取GIF
        # 例如: gif_url = f"https://example.com/gifs/{character}.gif"
        # gif_data = requests.get(gif_url).content
        # with open(gif_path, "wb") as f:
        #     f.write(gif_data)
        pass

    return send_file(gif_path, mimetype='image/gif')

# 需要一个启动点，但在Vercel中，你通常不需要这部分代码
if __name__ == "__main__":
    app.run()
