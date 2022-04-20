let corAnwers = [];
let questions = [];
let right = 0;
let maxQuestions = 0;
let curQuestion = 0;
let span = "<span class=\"closebtn\" onclick=\"this.parentElement.style.display='none';\">&times;</span>";

let startDiv = null;
let questionsDiv = null;
let resultDiv = null;
let submitQuestionsBnt = null;
let errorAlert = null;

let btn0 = null;
let btn1 = null;
let btn2 = null;
let btn3 = null;

/**
 * @desc This method loads all event listeners when the page is called
 */
function init() {
    document.getElementById("fileUpload").addEventListener('change', handleFileSelect, false);
    startDiv = document.getElementById("startDiv");
    questionsDiv = document.getElementById("questionsDiv");
    resultDiv = document.getElementById("resultDiv");
    submitQuestionsBnt = document.getElementById("submitQuestions");
    errorAlert = document.getElementById("errorDiv");

    btn0 = document.getElementById("0");
    btn1 = document.getElementById("1");
    btn2 = document.getElementById("2");
    btn3 = document.getElementById("3");

    /**
     * @desc Recalls the quiz
     */
    document.getElementById("backBT").addEventListener("click", (element => {
        questionsDiv.classList.add('hidden');
        resultDiv.classList.add('hidden');
        startDiv.classList.remove('hidden');
        start();
    }))

    /**
     * @desc Fetches the new question from the array and displays it. In case it was the last question, the result is displayed
     */
    document.getElementById("nextQuestion").addEventListener("click", e => {
        let currentIndex = questions.findIndex((item) => {
            return item.current;
        });
        questions[currentIndex].current = false;
        btn0.classList.remove("right", "wrong"); // mit .clasList.add/remove kann man klassen setzten statt setAtt
        btn1.classList.remove("right", "wrong");
        btn2.classList.remove("right", "wrong");
        btn3.classList.remove("right", "wrong");
        btn0.disabled = false;
        btn1.disabled = false;
        btn2.disabled = false;
        btn3.disabled = false;

        if (questions[currentIndex + 1]) {
            questions[currentIndex + 1].current = true;
            renderCurrentQuestion();
            document.getElementById("nextQuestion").classList.add("hidden");

        } else {
            let prozent = Math.round(right / corAnwers.length * 100, 0);
            startDiv.classList.add("hidden");
            resultDiv.classList.remove("hidden");
            questionsDiv.classList.add("hidden");
            document.getElementById("showResult").innerHTML = right + " out of " + corAnwers.length + " / " + prozent + "%";
            document.getElementById("resultProgress").setAttribute("style", "width:" + prozent + "%");
            document.getElementById("backBT").classList.remove('hidden');
            document.getElementById("nextQuestion").classList.add("hidden");
        }
    })
    start();
}


/**
 * @desc Executes an API call and fills the DropDown menu
 */
function start() {
    // reset everything
    startDiv.classList.remove("hidden");
    resultDiv.classList.add("hidden");
    questionsDiv.classList.add("hidden");
    corAnwers = [];
    right = 0;
    maxQuestions = 0;
    curQuestion = 0;
    questions = [];
    document.getElementById("dropDownCat").innerHTML = "";
    document.getElementById("nextQuestion").innerHTML = "Next Question";

    // get all categories
    fetch("https://opentdb.com/api_category.php")
        .then(response => response.text())
        .then(result => {
            let json = JSON.parse(result);
            json.trivia_categories.forEach(element => {
                let list = document.createElement("option");
                list.innerHTML = element.name;
                list.setAttribute("id", element.id);
                document.getElementById("dropDownCat").appendChild(list);
            });
        })
        .catch(error => {
                errorAlert.innerHTML = span + " Error by fetching the categories";
                errorAlert.setAttribute("style", "");
                errorAlert.classList.remove("hidden");
                start();
            }
        );
}

/**
 * @desc Gets the variables from the fields and calls the method getQuestions()
 */
function searchQuestions() {
    let amount = document.getElementById("amount").value;
    let diff = getDropDown("diff");
    let cat = getDropDown("dropDownCat");
    getQuestions(diff, cat, amount);
}

/**
 * @desc Submit the choosen Question and checks if it is right
 */
function submitAnswer(e) {
    btn0.disabled = true;
    btn1.disabled = true;
    btn2.disabled = true;
    btn3.disabled = true;
    btn0.classList.remove("right", "wrong");
    btn1.classList.remove("right", "wrong");
    btn2.classList.remove("right", "wrong");
    btn3.classList.remove("right", "wrong");
    let index = questions.findIndex((item) => {
        return item.current;
    });
    let givenAnswer = e.target.innerHTML;
    if (givenAnswer === corAnwers[index]) {
        right++;
        e.target.classList.add("right");
    } else {
        e.target.classList.add("wrong");
        valueRightBtn = corAnwers[index];
        let rightBtn = document.getElementsByName(valueRightBtn);
        rightBtn.item(0).classList.add("right");
    }
    nextQuestionBTN = document.getElementById("nextQuestion");
    if (curQuestion == maxQuestions)
        nextQuestionBTN.innerHTML = "Finish";
    nextQuestionBTN.classList.remove("hidden");
}

/**
 * @desc Quelle: https://stackoverflow.com/questions/16505333/get-the-data-of-uploaded-file-in-javascript
 */
function handleFileSelect(event) {
    const reader = new FileReader();
    reader.onload = handleFileLoad;
    reader.readAsText(event.target.files[0])
}

/**
 * @desc Quelle: https://stackoverflow.com/questions/16505333/get-the-data-of-uploaded-file-in-javascript
 */
function handleFileLoad(event) {
    let fileName = document.getElementById('fileUpload').files[0].name.split(".");
    let fileExtension = fileName[fileName.length - 1];
    if (fileExtension === "json") {
        try {
            let json = JSON.parse(event.target.result);
            getQuestions(json.Quiz.difficulty, json.Quiz.category, json.Quiz.amount);
        } catch (e) {
            errorAlert.innerHTML = span + " Wrong format in JSON file";
            errorAlert.setAttribute("style", "");
            errorAlert.classList.remove("hidden");
            start();
        }
    } else if (fileExtension === "xml") {
        //Quelle: https://stackoverflow.com/questions/17604071/parse-xml-using-javascript
        if (window.DOMParser) {
            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(event.target.result, "text/xml");
            try {
                let amount = xmlDoc.getElementsByTagName("amount")[0].firstChild.nodeValue;
                let diff = xmlDoc.getElementsByTagName("difficulty")[0].firstChild.nodeValue;
                let cat = xmlDoc.getElementsByTagName("category")[0].firstChild.nodeValue;
                getQuestions(diff, cat, amount);
            } catch (e) {
                errorAlert.innerHTML = span + " Wrong format in XML file";
                errorAlert.setAttribute("style", "");
                errorAlert.classList.remove("hidden");
                start();
            }
        } else // Internet Explorer
        {
            let xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(event.target.result);
            try {
                let amount = xmlDoc.getElementsByTagName("amount")[0].firstChild.nodeValue;
                let diff = xmlDoc.getElementsByTagName("difficulty")[0].firstChild.nodeValue;
                let cat = xmlDoc.getElementsByTagName("category")[0].firstChild.nodeValue;
                getQuestions(diff, cat, amount);
            } catch (e) {
                errorAlert.innerHTML = span + " Wrong format in XML file";
                errorAlert.setAttribute("style", "");
                errorAlert.classList.remove("hidden");
                start();
            }
        }
    } else {
        errorAlert.innerHTML = span + " Only XML or JSON files can be accepted.";
        errorAlert.setAttribute("style", "");
        errorAlert.classList.remove("hidden");
        start();
    }
}

/**
 * @desc get selected Item
 */
function getDropDown(id) {
    let sel = document.getElementById(id);
    let selected = sel.options[sel.selectedIndex].getAttribute("id");
    return selected;
}

/**
 * @desc Executes an API call with the inputs and fetches questions from the API
 */
function getQuestions(diff, cat, amount) {
    if (diff == undefined || cat == undefined || amount == undefined) {
        errorAlert.innerHTML = span + " <strong>Error!</strong>  wrong input format!";
        errorAlert.setAttribute("style", "");
        errorAlert.classList.remove("hidden");
        start();
    } else {
        maxQuestions = amount;
        startDiv.classList.add("hidden");
        resultDiv.classList.add("hidden");
        questionsDiv.classList.remove("hidden");
        fetch("https://opentdb.com/api.php?amount=" + amount + "&category=" + cat + "&difficulty=" + diff + "&type=multiple")
            .then(response => response.text())
            .then(result => {
                let json = JSON.parse(result);
                let element = json.results[0];
                element.current = true;
                questions = json.results;
                errorAlert.classList.add("hidden");

                renderCurrentQuestion();
            })
            .catch(error => {
                errorAlert.innerHTML = span + " <strong>Error!</strong> Error while fetching questions please check your input";
                errorAlert.setAttribute("style", "");
                errorAlert.classList.remove("hidden");
                start();
            });
    }
};

/**
 * @desc Current questions are displayed on the page
 */
function renderCurrentQuestion() {
    let element = questions.find((item) => {
        return item.current;
    });
    let count = 0;
    let status_p = document.getElementById("status_p");
    status_p.innerHTML = "You are at Question " + ++curQuestion + " out of " + maxQuestions;
    let question_p = document.getElementById("question_p");
    corAnwers.push(element.correct_answer);
    let answers = [element.correct_answer, ...element.incorrect_answers];
    question_p.innerHTML = element.question;
    for (let index = 0; index < 4; index++) {
        let random = Math.floor(Math.random() * answers.length);
        let bnr = document.getElementById(index);
        bnr.addEventListener("click", submitAnswer);
        bnr.setAttribute("name", answers[random]);
        bnr.innerHTML = answers[random];
        answers.splice(random, 1);
    }
    count++;
}