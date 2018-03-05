// pieChart. Chapter 16, Exercise 2. The pie chart.
"use strict";

$(document).ready(function() {

//
// Exercise 2 - The pie chart.
//
tprint("### Exercise 2");
var canvas1 = document.getElementById("canvas1");
showBorder(canvas1);
var cx1 = canvas1.getContext("2d");

var results2 = [
    {name: "Satisfied", count: 1043, color: "lightblue"},
    {name: "Neutral", count: 563, color: "lightgreen"},
    {name: "Unsatisfied", count: 510, color: "pink"},
    {name: "No comment", count: 175, color: "silver"}
];

function draw_pie_chart(cx, x, y, s, results) {
    cx.save();
    cx.translate(x, y);
    cx.scale(s, s);

    var total = results.reduce(function(sum, choice) {
        return sum + choice.count;
    }, 0);

    var currentAngle = -0.5 * Math.PI;
    cx.font = "10px Georgia";
    cx.fillStyle = "black";
    
    results.forEach(function(result) {
        var sliceAngle = (result.count / total) * 2 * Math.PI;
        console.log(sliceAngle);
        cx.beginPath();
        // center = (100, 100), radius = 100
        cx.arc(100, 100, 100, currentAngle, currentAngle + sliceAngle);

        var textAngle = currentAngle + 0.5 * sliceAngle;
        currentAngle += sliceAngle;
        cx.lineTo(100, 100);
        cx.fillStyle = result.color;
        cx.fill();
        
        var mx = 100, my = 100, r = 120;
        var x = mx + r * Math.cos(textAngle);
        var y = my + r * Math.sin(textAngle);
        if (textAngle > Math.PI * 3 / 2 || textAngle < Math.PI / 2)
            cx.fillText(result.name, x, y)
        else {
            // Assume each character is about 4 pixels wide on average.
            // It would be better to calculate using font metrics.
            var d = result.name.length * 4;
            cx.fillText(result.name, x - d, y)
        }
        //cx.fillRect(x, y, 10, 10);
        console.log("Text:",result.name,"textAngle:",textAngle);
        console.log("Result:",result.name);        
    });
    cx.restore();
}

draw_pie_chart(cx1, 100, 100, 1, results2);


}); /* $(document).ready */

