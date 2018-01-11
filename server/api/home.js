'use strict';
var fs = require("fs");
var fileName = '';
exports.goToIssue = function(page, params) { 
    page.action('home', 'issueList['+ params.index + '].viewdetails');
}
exports.submitissue = function (page, params) {	
    var dir = __dirname + "/../IssueImages/";

    //Create folder if it doesn't already exist
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    fileName = __dirname + "/../IssueImages/" + params.fileName;
    //Save file in server/IssueImages folder and delete after uploaded to website
    require("fs").writeFile(__dirname + "/../IssueImages/" + params.fileName, params.blobContent, 'binary',
        function (err) {
            page.uploadFile('input[type=file]', fileName);
        });
	//Need to revisit setTimeout code
    setTimeout(function () {
        page.update("reportissues", params)
            .action("reportissues", "submitIssues")
            .then(function () {
                fs.unlinkSync(fileName);
            });
    }, 5000); 
};