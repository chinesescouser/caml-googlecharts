//CAML and Google Charts

<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
    <!--BEGIN - GOOGLE CHARTS-->
<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>

<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/themes/smoothness/jquery-ui.css" />
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery.SPServices/2014.02/jquery.SPServices.min.js"></script>
<script type="text/javascript">

//Date Conversion
    function convertSPDate(d) {
    /*
    *  A function to convert a standard SharePoint
    *  date/time field (YYYY-MM-DD HH:MM:SS) to a
    *  javascript Date() object
    *
    *  Author: Ben Tedder (www.bentedder.com)
    */
        // split apart the date and time
        var xDate = d.split(" ")[0];
        var xTime = d.split(" ")[1];
    
        // split apart the hour, minute, & second
        var xTimeParts = xTime.split(":");
        var xHour = xTimeParts[0];
        var xMin = xTimeParts[1];
        var xSec = xTimeParts[2];
    
        // split apart the year, month, & day
        var xDateParts = xDate.split("-");
        var xYear = xDateParts[0];
        var xMonth = xDateParts[1];
        var xDay = xDateParts[2];
    
        var dDate = new Date(xYear, xMonth, xDay, xHour, xMin, xSec);
        return dDate;
    }

    function createDataTable(dataExtract) {
        
        var numCols = dataExtract.length;
        var numRows = dataExtract[0].length;
        var dataTable = new google.visualization.DataTable();
        var totalTransactions = 0;
        
        //dataTable.addColumn('number', 'Index');
        dataTable.addColumn ('date', 'Time of Purchase');
        dataTable.addColumn('number', 'Count');
        

        for (var x=0; x < numRows; x++) {
            var dateExtract = convertSPDate(dataExtract[1][x]);
            dataTable.addRow([
                                (new Date(dataExtract[1][x])),(parseInt(dataExtract[0][x]))
                            ]);
            totalTransactions += parseInt(dataExtract[0][x]);
                //dataTable.addRow([dataExtract[i][x], new Date(dataExtract[i][x])]);
                
                //dataTable.addRow(dataExtract[0][1]);
        }
        createChart(dataTable);
    }  //END createDataTable
    
    
    
    function createChart(dataTable) {

        
        var options = {
                        chart: {
                            title: 'Transactions Purchased',
                        },
                        series: {
                            0: {
                                axis: 'Transactions',
                                labelInLegend: 'Transactions Purchased',
                                pointShape:'diamond',
                                pointSize: 10,
                            }
                        },
                        axes: {
                            y: {
                                Transactions: {label: 'Transactions'},
                            }
                        },
                        width: '100%',
                        height: 'auto'
                        }

        // redraw the chart.
        //Drawing Classic charts
        var chart = new google.visualization.LineChart(document.getElementById('chart03'));
        chart.draw(dataTable, options);


        //Drawing Google Material charts
        //var chart = new google.charts.Line(document.getElementById('chart02'));
        //chart.draw(dataTable, google.charts.Line.convertOptions(options));
            
    } //END createChart

</script>
<script type="text/javascript">
        

google.charts.load('current', {packages: ['corechart', 'table', 'line']});

google.charts.setOnLoadCallback(function(){
        
 $(document).ready(function() {

        var dataWebPartId = '{XXXX-XXXX}';   // WebPart ID
        PrePurchasedList();
        getTransactionListValues();
 
});
 
function PrePurchasedList() {
    var method = "GetListItems";
    var list= "PrePurchasedTransactions";
    var fieldsToRead = "<ViewFields>" +
                    "<FieldRef Name='TransactionsPurchased' />" +
                    "<FieldRef Name='DatePurchased' />" +
                    "</ViewFields>";
    var query = "<Query>" + 
                        "<Where>" +
                            "<Neq>" +
                                "<FieldRef Name='ID'/><Value Type='Number'>0</Value>" + 
                            "</Neq>" +
                        "</Where>" +
                    "</Query>";
    var attrToRead = ["ows_TransactionsPurchased", "ows_DatePurchased"];
    var dataExtract = getQueryDataset(method, list, fieldsToRead, query, attrToRead);
    createDataTable(dataExtract);
}
 
function getQueryDataset(method, list, fieldsToRead, query, attrToRead, numAttrToRead){

    var dataExtract = [[],[]];
        
    $().SPServices({ 
      operation: method,
      async: false,
      listName: list,
      CAMLViewFields: fieldsToRead,
      CAMLQuery: query,
      completefunc: function(xData, Status) {
        var rowCount = $(xData.responseXML).SPFilterNode("z:row").length;
            $(xData.responseXML).SPFilterNode("z:row").each(function(i) {
                for (var x=0; x < attrToRead.length; x++) {
                    dataExtract[x].push($(this).attr(attrToRead[x]));
                }                
            });  //END each loop
      } //END completeFunc
    });  //END SPServices
    
    return dataExtract;
}
 
function getPrePurchasedListValues() {
    
    var datePurExtract;
    var datePurMonth;
    var datePurYear;
    var datePurMonthYear;
    var totalPurTransactions = 0;
    var method = "GetListItems";
    var list= "PrePurchasedTransactions";
    var fieldsToRead = "<ViewFields>" +
                    "<FieldRef Name='TransactionsPurchased' />" +
                    "<FieldRef Name='DatePurchased' />" +
                    "</ViewFields>";
    var query = "<Query>" + 
                        "<Where>" +
                            //"<Or>" +
                            "<Neq>" +
                                "<FieldRef Name='ID'/><Value Type='Number'>0</Value>" + 
                            "</Neq>" +
                            //"<Gt>" +
                            //    "<FieldRef Name='DatePurchased' /><Value Type='DateTime'>2016-10-01T01:00:00Z</Value>"+
                            //"</Gt>" + 
                            //"</Or>" +
                        "</Where>" +
                        //"<OrderBy>" + 
                        //    "<FieldRef Name='Title'/>" +
                        //"</OrderBy>" +
                    "</Query>";
                    
    $().SPServices({ 
      operation: method,
      async: false,
      listName: list,
      CAMLViewFields: fieldsToRead,
      CAMLQuery: query,
      completefunc: function(xData, Status) {
        $(xData.responseXML).SPFilterNode("z:row").each(function() {
            purTrans = 0;
            var purTrans = parseFloat($(this).attr("ows_TransactionsPurchased"));            
            if(!isNaN(purTrans)) {
               totalPurTransactions += purTrans;
            }
        });  //END each loop
      } //END completeFunc
    });  //END SPServices
    return totalPurTransactions;
}  //END Function


function getTransactionListValues() {
    var TotalCount=0;
    var monthOnly =0;
    var indexCount = 0;
    var transDate;
    var plannername;
    var transMonth;
    var transDateExtract;
    var transMonthArray = new Array();
    var totalPurTrans = getPrePurchasedListValues();
    
    var method = "GetListItems";
    var list= "MonthlyTransactions";
    var fieldsToRead = "<ViewFields>" +
                        "<FieldRef Name='Title' />" +
                        "<FieldRef Name='Totals' />" +
                        "<FieldRef Name='Transaction_x0020_Month' />" + 
                        "<FieldRef Name='Planner_x0020_Email' />" +
                        "</ViewFields>";
    var query = "<Query>" + 
                            "<Where>" +
                                "<Neq>" +
                                    "<FieldRef Name='ID'/><Value Type='Number'>0</Value>" + 
                                "</Neq>" +
                            "</Where>" +
                            //"<OrderBy>" + 
                            //    "<FieldRef Name='Title'/>" +
                            //"</OrderBy>" +
                        "</Query>";
                        
        $().SPServices({ 
          operation: method,
          async: false,
          listName: list,
          CAMLViewFields: fieldsToRead,
          CAMLQuery: query,
          completefunc: function(xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function() {
                eventTotal = 0;
                var eventCode = ($(this).attr("ows_Title"));
                eventTotal = parseFloat($(this).attr("ows_Totals"));
                transDate = ($(this).attr("ows_Transaction_x0020_Month"));
                if(!isNaN(eventTotal)) {
                   TotalCount += eventTotal;
                }
                //Parse Date
                transDateExtract = convertSPDate(transDate);
                transMonth = transDateExtract.getMonth();       
                if (!isNaN(transMonth)) {
                    if (transMonth == 10) {
                        transMonthArray.push(TotalCount);
                    }
                    if (transMonth == 11) {
                        transMonthArray.push[TotalCount];
                    }
                }
                //indexCount += 1;
                //updateArray(eventCode, eventTotal, monthOnly,indexCount);
            });  //END each loop
    console.log(transMonthArray.length);
    createChart01(TotalCount, totalPurTrans);
    //createChart02(TotalCount, transMonthArray);

      } //END SPServices
}); //END getTransactionListValues


    function createChart01(totals, purchasedtrans) { 
    
        var data2 = google.visualization.arrayToDataTable([
                ['Available Transactions', 'Transactions Consumed'],
                ['Contracted', purchasedtrans],
                ['Transactions', totals]
              ]);
         var options = {
                    title: 'Transactions Consumed',
                    pieSliceText: 'label'
                  };
                
        //Drawing Classic Chart
        var chart = new google.visualization.PieChart(document.getElementById('chart01'));
        chart.draw(data2, options);
        
        
    }  //END createChart01

    function createChart02(TotalCount, transMonthArray) {
        var data = google.visualization.arrayToDataTable([

                    ]);
        var chart = new google.charts.Bar(document.getElementById('chart02'));
        chart.draw(data);
    }


}

});
    </script>
<div id="chart01" style="width: 900px; height: 500px; margin: 0 auto;"></div>
<div id="chart02" style="width: 900px; height: 500px; margin: 0 auto;display:none;"></div>
<div id="chart03" style="width: 900px; height: 500px; margin: 0 auto;"></div>
