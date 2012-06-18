import requests

def create_user():
    r = requests.post('http://localhost:3000/accounts/create', 
            data={'email': 'a@a.com', 'password': '123', 'nickname': 'aaa'})
    print r.text

def bind_user():
    r = requests.post('http://localhost:3000/bind', 
            data={'email': 'a@a.com', 'password': '123', 'deviceid': 'xz123'})
    print r.text

def report():
    r = request.post('http://localhost:3000/report?message=xz123,133000000,139.0,46.0,10,5,10')
    print r.text
