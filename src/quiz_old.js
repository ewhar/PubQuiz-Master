let corAnwers = [];
let questions = [];
let right = 0;

let startDiv = null;
let questionsDiv = null;
let resultDiv = null;
let submitQuestionsBnt = null;
let errorAlert = null;

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

    /**
     * @desc Gets the variables from the fields and calls the method getQuestions()
     */
    document.getElementById("searchQuestions").addEventListener("click", e => {
        let amount = document.getElementById("amount").value;
        let diff = getDropDown("diff");
        let cat = getDropDown("dropDownCat");
        getQuestions(diff, cat, amount);
    });

    /**
     * @desc Confirms the answer and checks for correctness
     */
    document.getElementById("submitQuestions").addEventListener("click", e => {
        let countName = 0;
        let radio = document.querySelectorAll('input[type="radio"]');
        radio.forEach(element => {
            element.setAttribute("disabled", "")
        });

        let index = questions.findIndex((item) => {
            return item.current;
        });
        let givenAnswer = document.querySelector('input[name="' + countName++ + '"]:checked').value;
        console.log(givenAnswer);
        if (givenAnswer === corAnwers[index]) {
            right++;
        }
        document.getElementById(corAnwers[index]).setAttribute("class", "right");
        document.getElementById("submitQuestions").classList.add('hidden');
        document.getElementById("nextQuestion").classList.remove("hidden");
    });

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

        if (questions[currentIndex + 1]) {
            questions[currentIndex + 1].current = true;
            renderCurrentQuestion();

            document.getElementById("submitQuestions").classList.remove('hidden');
            document.getElementById("nextQuestion").classList.add("hidden");

        } else {
            let prozent = Math.round(right / corAnwers.length * 100, 0);
            startDiv.classList.add("hidden");
            resultDiv.classList.remove("hidden");
            questionsDiv.classList.add("hidden");
            submitQuestionsBnt.classList.remove("hidden");
            document.getElementById("submitQuestions").classList.add("hidden");
            document.getElementById("showResult").innerHTML = right + " out of " + corAnwers.length;
            document.getElementById("resultProgress").setAttribute("style", "width:" + prozent + "%");
            document.getElementById("resultProgress").innerHTML = prozent + " %";
            document.getElementById("backBT").classList.remove('hidden');
            document.getElementById("nextQuestion").classList.add("hidden");
        }

        console.log(currentIndex);
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
    submitQuestionsBnt.classList.add("hidden");
    corAnwers = [];
    right = 0;
    questions = [];
    document.getElementById("dropDownCat").innerHTML = "";

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
                errorAlert.innerHTML = "Error by fetching the categories";
                errorAlert.setAttribute("class", "visible");
            }
        );
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
            errorAlert.innerHTML = "Wrong format in JSON file";
            errorAlert.setAttribute("class", "visible");
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
                errorAlert.innerHTML = "Wrong format in XML file";
                errorAlert.setAttribute("class", "visible");
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
                errorAlert.innerHTML = "Wrong format in XML file";
                errorAlert.setAttribute("class", "visible");
            }
        }
    } else {
        errorAlert.innerHTML = "Only XML or JSON files can be accepted.";
        errorAlert.setAttribute("class", "visible");
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
        alert("Wrong Format");
        init();
    } else {
        startDiv.classList.add("hidden");
        resultDiv.classList.add("hidden");
        questionsDiv.classList.remove("hidden");
        submitQuestionsBnt.classList.remove("hidden");
        document.getElementById("questions").innerHTML = "";
        fetch("https://opentdb.com/api.php?category=" + cat + "&amount=" + amount + "&difficulty=" + diff + "&type=multiple")
            .then(response => response.text())
            .then(result => {
                let json = JSON.parse(result);
                let element = json.results[0];
                element.current = true;
                questions = json.results;
                renderCurrentQuestion();
            })
            .catch(error => {
                errorAlert.innerHTML = "Error while fetching questions";
                errorAlert.setAttribute("class", "visible");
            });
    }
};

/**
 * @desc Current questions are displayed on the page
 */
function renderCurrentQuestion() {
    console.log(questions);
    let element = questions.find((item) => {
        return item.current;
    });
    let count = 0;
    let div = document.createElement("div");
    div.classList.add("form-check");
    let question = document.createElement("p");
    let form = document.createElement("form");
    corAnwers.push(element.correct_answer);
    let answers = [element.correct_answer, ...element.incorrect_answers];

    for (let index = 0; index < 4; index++) {
        let random = Math.floor(Math.random() * answers.length);
        let rb = document.createElement("input");
        let br = document.createElement("br");
        rb.setAttribute("type", "radio");
        rb.setAttribute("name", count);
        if (index == 0)
            rb.setAttribute("checked", "");
        rb.setAttribute("value", answers[random]);
        let lable = document.createElement("label");
        lable.innerHTML = answers[random];
        lable.setAttribute("id", answers[random]);
        lable.appendChild(rb);
        form.appendChild(lable);
        form.appendChild(br);
        answers.splice(random, 1);
    }
    count++;
    question.innerHTML = element.question;
    div.appendChild(question);
    div.appendChild(form);
    document.getElementById("questions").innerHTML = '';
    document.getElementById("questions").appendChild(div);
}