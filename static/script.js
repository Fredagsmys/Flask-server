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


function getData() {
    var xhr = new XMLHttpRequest();
    xhr.onload = () => {
        
        response = JSON.parse(xhr.responseText)
        console.log(response)
        dataList.innerHTML = ""
        var myData = [];
        response.forEach( (item,index) => {
            console.log()
            if (item["sensorID"] == 2){
            myData.push({x: item["date"], y: item["value"]})
            }
            // var li = document.createElement("li")
            // li.innerHTML = JSON.stringify(item)
            // dataList.appendChild(li)
        })
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
                        min: "2023-06-17 10:00:00",
                        type: 'time',
                        time: {
                          unit: 'day',
                          displayFormats: {
                            day: 'D MMM yyyy'
                          }
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





