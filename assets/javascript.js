// Initialize Firebase
var config = {
    apiKey: "AIzaSyD1xcRuUXej5K4JMBzWFSrJG1G9ClPeoUI",
    authDomain: "week7firebasehw.firebaseapp.com",
    databaseURL: "https://week7firebasehw.firebaseio.com",
    projectId: "week7firebasehw",
    storageBucket: "",
    messagingSenderId: "277580337847"
};
firebase.initializeApp(config);

//Global Variables
var dataRef = firebase.database();
//Initial Values
var train = "";
var city = "";
var firstTrainTime = "00:00";
var frequencyMin = 0;

// onclick

$("#sub-butt").on("click", function (event) {
    event.preventDefault();

    train = $("#trainName").val().trim();
    city = $("#destination").val().trim();
    firstTrainTime = $("#firstTrain").val().trim();
    frequencyMin = $("#frequency").val().trim();
    frequencyMin = parseInt(frequencyMin);

    console.log("Name from form: ", train);
    console.log("Destination from form: ", city);
    console.log("First arrival from form: ", firstTrainTime);
    console.log("Frequency from form: ", frequencyMin);

    if (train === "") {
        alert("Bro! gotta fill out the form!");
    } else {

        //push to database

        dataRef.ref().push({
            trainName: train,
            destination: city,
            firstTrain: firstTrainTime,
            frequency: frequencyMin

        });

        //clear the form after data submission
        $("#trainName").val("");
        $("#destination").val("");
        $("#firstTrain").val("");
        $("#frequency").val("");

    }
});

//firebase event for adding a row to the HTML when the user adds a train.
dataRef.ref().on("child_added", function (childSnapshot, prevChildKey) {

    console.log("childSnapshot: ", childSnapshot.val());

    // store the snapshot into variables
    var chTrainName = childSnapshot.val().trainName;
    var chDestination = childSnapshot.val().destination;
    var chFirstTrainTime = childSnapshot.val().firstTrain;
    var chFrequency = childSnapshot.val().frequency;

    console.log("chFtrain: ", chFirstTrainTime);


    var firstConvert = moment(chFirstTrainTime, "HH:mm").subtract(1, "years");
    console.log("firstConvert: ", firstConvert);

    //Current time
    var currentTime = moment();
    console.log("current time: ", moment(currentTime).format("HH:mm"));
    //Difference between the times
    var timeDiff = currentTime.diff(firstConvert, "minutes");
    console.log("time difference: ", timeDiff);
    //time apart (Remainder)
    var Remainder = timeDiff % chFrequency;
    console.log("Remainder: ", Remainder);
    //minutes until train
    var minutesTil = chFrequency - Remainder;
    console.log("minutes until next train: ", minutesTil);
    //next train time
    var nextTrain = moment().add(minutesTil, "minutes").format("HH:mm");
    console.log("next arrival time: ", moment(nextTrain));
    console.log("------------------------------------------------------------");



    //Add train data to the table
    $("#train-table > tbody").append("<tr><td>" + chTrainName + "</td><td>" + chDestination + "</td><td>" +
        chFrequency + "</td><td>" + nextTrain + "</td><td>" + minutesTil + "</td></tr>");


});