from flask import Flask, request, send_file
import os
import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException, TimeoutException, ElementClickInterceptedException
import time

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
        gif_data = download_gif(character)
        if gif_data:
            with open(gif_path, "wb") as f:
                f.write(gif_data)
        else:
            return "GIF not found", 404

    return send_file(gif_path, mimetype='image/gif')

def download_gif(character):
    options = Options()
    options.headless = True  # 使用无头浏览器
    driver = webdriver.Chrome(options=options)
    
    try:
        driver.get("https://hanyu.baidu.com/")
        search_box = driver.find_element(By.ID, "kw")
        search_box.send_keys(character)
        search_button = driver.find_element(By.ID, "su")
        search_button.click()
        time.sleep(5)

        try:
            gif_img = driver.find_element(By.XPATH, "//img[contains(@src, '.gif')]")
            gif_url = gif_img.get_attribute("src")
            gif_data = requests.get(gif_url).content
            return gif_data
        except NoSuchElementException:
            links = driver.find_elements(By.PARTIAL_LINK_TEXT, character)
            for link in links:
                try:
                    link.click()
                    time.sleep(5)
                    gif_img = driver.find_element(By.XPATH, "//img[contains(@src, '.gif')]")
                    gif_url = gif_img.get_attribute("src")
                    gif_data = requests.get(gif_url).content
                    return gif_data
                except (NoSuchElementException, TimeoutException, ElementClickInterceptedException):
                    continue
    finally:
        driver.quit()
    return None

if __name__ == "__main__":
    app.run()
