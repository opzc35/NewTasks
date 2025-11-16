from flask import Flask, render_template

app = Flask(__name__)

test_list = ["任务1", "任务2", "任务3"] #这个纯测试代码，后期会删除并用数据库

@app.route('/')
def index():
    return ('Welcome to NewTasks')

@app.route('/show/tasks')
def show_tasks():
    return render_template('show_tasks.html', tasks=test_list)

if __name__ == '__main__':
    app.run(debug=True)