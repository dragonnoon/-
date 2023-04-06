import numpy as np
from main import *
from flask import Flask, request, render_template
import pickle
from pyecharts import options as opts
from pyecharts.charts import Bar
import os
import random

# 实例化一个app应用，并导入数据
app = Flask(__name__)

# 初始页面，装饰器@app.route("/")定义路由，当用户在浏览器输入的路由路径为"/"时，前端直接渲染初始界面
@app.route("/")
def Home():
    return render_template("beautiful_index.html")

# 定义一个预测路由，以post方式提交数据
@app.route("/predict", methods = ["POST","GET"])
def predict():
    name = request.form['name']
    file_name = "./个人信息/" + name + '.txt'
    if os.path.exists(file_name) == False:
        return render_template("beautiful_index.html", name = name, prediction_text = "不存在该人员进出信息")
    with open(file_name, 'r' ,encoding='utf-8') as f:
        lines = f.readlines()
        str = ""
        for i in lines:
            str += i
    # 在用户输入数据上预测出结果后，返回在初始界面上

    return render_template("beautiful_index.html", name = name, prediction_text = str)

@app.route('/picture', methods=['GET', 'POST'])
def uploads():
    img = request.files.get('face')   # 接收图片
    name = request.form.get('names')   # 接收附加信息
    index_jpg = random.randint(1, 100000)
    name = str(name) + ' ' + str(index_jpg) + '.jpg'   # 保存图片的名称，一定要加上后缀名，同时防止同一个人上传多张图片会被覆盖，使用随机数来扩充下标
    print(name)
    img.save(os.path.join('./database/', name))
    return 'success'

def bar_base() -> Bar:
    with open("./校内人员数量.txt", 'r', encoding='utf-8') as f:
        line_human = f.readline()
        human_number = int(line_human)
    c = (
        Bar()
            .add_xaxis(["校内人员数量", "校外人员数量"])
            .add_yaxis("商家A", [human_number, random.randint(10, 100)])
            .set_global_opts(title_opts=opts.TitleOpts(title="", subtitle=""))
    )
    return c

@app.route("/barChart")
def get_bar_chart():
    c = bar_base()
    return c.dump_options_with_quotes()

if __name__ == "__main__":
    app.run(debug=True)