from flask import Flask,request,render_template
import json
import mysql.connector
from mysql.connector import Error
import datetime

app = Flask(__name__)
water_status = "0"

@app.route("/")
def hello_world():
    return render_template("index.html")

@app.get("/get_water_status")
def get_water_status():
    global water_status
    if water_status == "0":
        return "0"
    else:
        water_status = "0"
        return "1"
    
@app.route("/set_water_status")
def set_water_status():
    global water_status
    water_status = "1"
    return "success"



@app.route("/send_data", methods = ['GET', 'POST'])
def recv_data():
    if request.method == 'POST':
        
        status = 0
        jsonmsg = request.get_json()
        # jsonmsg = json.loads(req)
        value = jsonmsg["value"]
        sensorType = jsonmsg["sensorType"]
        sensorID = jsonmsg["sensorID"]
        print(value)
        try:
            connection = mysql.connector.connect(host='localhost',
                                                database='sensorData',
                                                user='root',
                                                password='Baggenq321')
            if connection.is_connected():
                db_Info = connection.get_server_info()
                print("Connected to MySQL Server version ", db_Info)
                cursor = connection.cursor()
                cursor.execute("select database();")
                record = cursor.fetchone()
                print("You're connected to database: ", record)
                cursor.execute(f"INSERT INTO data (VALUE, SENSORTYPE, SENSORID) VALUES ({value},{sensorType},{sensorID})")
                connection.commit()
                
        except Error as e:
            print("Error while connecting to MySQL", e)
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()
                print("MySQL connection is closed")
    
    # assume data is json {sensorID: 2, sensorType: 3, value: 13.4}
    

    return str(status)

@app.get("/get_data")
def get_data():
    try:
        connection = mysql.connector.connect(host='localhost',
                                            database='sensorData',
                                            user='root',
                                            password='Baggenq321')
        if connection.is_connected():
            db_Info = connection.get_server_info()
            print("Connected to MySQL Server version ", db_Info)
            cursor=connection.cursor()
            cursor.execute("select database();")
            record = cursor.fetchone()
            print("You're connected to database: ", record)
            cursor.execute("select * from data;")
            resultList = cursor.fetchall()
            responseList = []
            # print(resultList)
            for res in resultList:
                date = res[1].strftime('%Y-%m-%d %H:%M:%S')
                responseList.append({"value": res[2], "date":date , "sensorType": res[3], "sensorID": res[4]})
            # print(responseList)
            return json.dumps(responseList)
    except Error as e:
        print("Error while connecting to MySQL", e)
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection is closed")

if __name__ == "__main__":
    app.run(host="0.0.0.0")