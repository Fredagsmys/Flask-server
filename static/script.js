const sendButton = document.querySelector("#send-button");
const dataField = document.querySelector("#data-field");
const typeField = document.querySelector("#type-field");
const idField = document.querySelector("#id-field");
const waterButton = document.querySelector("#water-button");
var ctx = document.getElementById("ctx").getContext("2d");

const getButton = document.querySelector("#get-button");
const dataList = document.querySelector("#data-list")

sendButton.addEventListener("click", sendData);
getButton.addEventListener("click", getData);
waterButton.addEventListener("click",sendWaterCommand);
var timeFormat = 'moment.ISO_8601';
var lineChart = document.getElementById('ctx').getContext('2d');

getData();


function sendWaterCommand(){
    var xhr = new XMLHttpRequest();
    xhr.onload = () => {
        if (xhr.responseText == "success"){
            alert("Water command sent successfully");
        }
    }
    xhr.open("GET", "/set_water_status");
    xhr.send("water");
}
function GetCurDate(){
    var currDateObj = new Date();
    var numberOfMlSeconds = currDateObj.getTime();
    var addMlSeconds = 60 * 60 * 1000;
    var dateObj = new Date(numberOfMlSeconds - addMlSeconds);

    let year = dateObj.getFullYear();

    let month = dateObj.getMonth();
    month = ('0' + (month + 1)).slice(-2);
    // To make sure the month always has 2-character-format. For example, 1 => 01, 2 => 02

    let date = dateObj.getDate();
    date = ('0' + date).slice(-2);
    // To make sure the date always has 2-character-format

    let hour = dateObj.getHours();
    hour = ('0' + hour).slice(-2);
    // To make sure the hour always has 2-character-format

    let minute = dateObj.getMinutes();
    minute = ('0' + minute).slice(-2);
    // To make sure the minute always has 2-character-format

    let second = dateObj.getSeconds();
    second = ('0' + second).slice(-2);
    // To make sure the second always has 2-character-format

    var time = `${year}-${month}-${date} ${hour}:${minute}:${second}`;
    
    return time;
}

function getData() {
    var xhr = new XMLHttpRequest();
    xhr.onload = () => {
        date = GetCurDate();
        console.log(date);
        response = JSON.parse(xhr.responseText)
        console.log(response)
        dataList.innerHTML = ""
        var myData = [];
        response.forEach( (item,index) => {
            if (item["sensorID"] == 2){
            myData.push({x: item["date"], y: item["value"]})
            }
            var li = document.createElement("li")
            li.innerHTML = JSON.stringify(item)
            dataList.appendChild(li)
            })
            Array.from(dataList.children).reverse().forEach(element =>dataList.appendChild(element));
        new Chart('ctx', {
            type: 'line',
            data: {
                datasets: [{
                    data: myData
                }],
            },
            options: {
                
                scales: {
                    x: {
                        min: date,
                        type: 'time',
                        time: {
                          unit: 'minute',
                        //   displayFormats: {
                        //     auto
                        //   }
                        }
                      }
                }
            }
        });
    }
    xhr.open("GET", "/get_data");
    xhr.send();
}

function sendData(event) {
    var id = idField.value;
    var type = typeField.value;
    var value = dataField.value;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/send_data");
    xhr.onload = () => {
        getData()
    }
    xhr.setRequestHeader("Content-Type", "application/json");
    const jsonmsg = `{\"sensorID\": ${id}, \"sensorType\": ${type}, \"value\": ${value}}`
    var sendMsg = JSON.stringify(jsonmsg);
    console.log(sendMsg);
    xhr.send(sendMsg);
}





