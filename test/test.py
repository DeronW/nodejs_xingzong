import requests
import random
import datetime
import time

def create_user():
    r = requests.post('http://localhost:3000/accounts/create', 
            data={'email': 'a@a.com', 'password': '123', 'nickname': 'aaa'})
    print r.text

def bind_user():
    r = requests.post('http://localhost:3000/bind', 
            data={'email': 'a@a.com', 'password': '123', 'deviceid': 'xz123'})
    print r.text

def report():

    deviceid = 'xz123'
    timestamp = int(1000 * time.mktime(datetime.datetime.now().timetuple()))
    lng = 116 + random.random() / 10
    lat = 39 + random.random() / 10
    elevation = 100 * random.random()
    accuray = 20 * random.random()
    speed = 20 * random.random()

    message = '{deviceid},{timestamp},{lng},{lat},{elevation},{accuray},{speed}'.format(
            deviceid=deviceid, 
            timestamp=timestamp, 
            lng=lng, 
            lat=lat, 
            elevation=elevation, 
            accuray=accuray, 
            speed=speed)

    r = requests.post('http://localhost:3000/report', data={'message': message})
    print r.text
